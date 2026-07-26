import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { DronesService } from '../drones/drones.service';
import { OrdersService } from '../orders/orders.service';
import { AllocationService } from '../simulation/allocation.service';
import { ObstaclesService } from '../simulation/obstacles.service';
import { SIMULATION_CONFIG } from '../simulation/simulation.config';
import { DroneStatus } from '../common/enums/drone-status.enum';
import { StatusPedido } from '../orders/interfaces/pedido.interface';
import { StatusViagem, Viagem } from './interfaces/viagem.interface';
import { ViagensService } from './viagens.service';
import { DroneFlightService } from './drone-flight.service';

@Injectable()
export class FilaProcessamentoService implements OnModuleInit {
  private readonly logger = new Logger(FilaProcessamentoService.name);
  private processandoFila = false;

  constructor(
    private readonly dronesService: DronesService,
    private readonly ordersService: OrdersService,
    private readonly allocationService: AllocationService,
    private readonly obstaclesService: ObstaclesService,
    private readonly viagensService: ViagensService,
    private readonly droneFlightService: DroneFlightService,
  ) {}

  onModuleInit() {
    setInterval(() => {
      this.processarFila().catch((err) =>
        this.logger.error('Erro ao processar fila de pedidos', err),
      );
    }, SIMULATION_CONFIG.MS_INTERVALO_FILA);
  }

  async processarFila(): Promise<Viagem[]> {
    if (this.processandoFila) return [];
    this.processandoFila = true;

    try {
      const pendentes = this.ordersService.listarPendentes();
      const dronesDisponiveis = this.dronesService.listarDisponiveis();
      if (pendentes.length === 0 || dronesDisponiveis.length === 0) {
        return [];
      }

      const obstaculos = this.obstaclesService.listarTodos();
      const { viagens: planejadas, naoAlocados } =
        this.allocationService.otimizarAlocacao(
          pendentes,
          dronesDisponiveis,
          obstaculos,
        );

      naoAlocados.forEach(({ pedido, motivo }) =>
        this.logger.warn(
          `Pedido ${pedido.id} não alocado nesta rodada: ${motivo}`,
        ),
      );

      const viagensCriadas: Viagem[] = [];

      for (const planejada of planejadas) {
        const duracaoVooMs = planejada.distanciaTotalKm * SIMULATION_CONFIG.MS_POR_KM;
        const duracaoEntregasMs =
          planejada.pedidos.length * SIMULATION_CONFIG.MS_ENTREGA;

        const viagem: Viagem = this.viagensService.criar({
          id: uuid(),
          droneId: planejada.droneId,
          pedidoIds: planejada.pedidos.map((p) => p.id),
          ordemParadas: planejada.ordemParadas,
          pesoTotalKg: planejada.pesoTotalKg,
          distanciaTotalKm: planejada.distanciaTotalKm,
          status: StatusViagem.PLANEJADA,
          criadaEm: new Date(),
          duracaoEstimadaSegundos: Math.round(
            (SIMULATION_CONFIG.MS_CARREGAMENTO +
              duracaoVooMs +
              duracaoEntregasMs) /
              1000,
          ),
        });

        viagensCriadas.push(viagem);

        planejada.pedidos.forEach((pedido) =>
          this.ordersService.atualizar(pedido.id, {
            status: StatusPedido.ALOCADO,
            droneId: planejada.droneId,
            viagemId: viagem.id,
          }),
        );

        this.dronesService.atualizar(planejada.droneId, {
          status: DroneStatus.CARREGANDO,
          viagemAtualId: viagem.id,
        });

        this.droneFlightService
          .executar(viagem)
          .then(() => this.processarFila())
          .catch((err) =>
            this.logger.error(`Erro executando viagem ${viagem.id}`, err),
          );
      }

      return viagensCriadas;
    } finally {
      this.processandoFila = false;
    }
  }
}
