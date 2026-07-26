import { Injectable } from '@nestjs/common';
import { DronesService } from '../drones/drones.service';
import { OrdersService } from '../orders/orders.service';
import { BatteryService } from '../simulation/battery.service';
import { SIMULATION_CONFIG } from '../simulation/simulation.config';
import { distanciaEuclidiana } from '../simulation/utils/geo.util';
import { DroneStatus } from '../common/enums/drone-status.enum';
import { StatusPedido, Coordenada } from '../orders/interfaces/pedido.interface';
import { BASE } from '../drones/interfaces/drone.interface';
import { StatusViagem, Viagem } from './interfaces/viagem.interface';
import { ViagensService } from './viagens.service';

@Injectable()
export class DroneFlightService {
  constructor(
    private readonly dronesService: DronesService,
    private readonly ordersService: OrdersService,
    private readonly viagensService: ViagensService,
    private readonly batteryService: BatteryService,
  ) {}

  async executar(viagem: Viagem): Promise<void> {
    const drone = this.dronesService.buscarPorId(viagem.droneId);
    const numeroDeTrechos = viagem.ordemParadas.length + 1;

    this.viagensService.atualizar(viagem.id, {
      status: StatusViagem.EM_ANDAMENTO,
      iniciadaEm: new Date(),
    });

    // 1. Carregando (preparo na base)
    await this.aguardar(SIMULATION_CONFIG.MS_CARREGAMENTO);
    this.dronesService.atualizar(drone.id, { status: DroneStatus.EM_VOO });

    // 2. Em voo -> Entregando, uma parada por vez
    let posicaoAtual: Coordenada = { ...BASE };
    let bateria = 100;

    for (let i = 0; i < viagem.ordemParadas.length; i++) {
      const destino = viagem.ordemParadas[i];
      await this.voarAte(drone.id, posicaoAtual, destino);
      posicaoAtual = destino;

      bateria = this.batteryService.consumirTrecho(
        drone.id,
        bateria,
        viagem.distanciaTotalKm,
        numeroDeTrechos,
      );

      this.dronesService.atualizar(drone.id, {
        status: DroneStatus.ENTREGANDO,
        posicaoAtual: destino,
        legAtual: undefined,
      });

      const pedidoId = viagem.pedidoIds[i];
      this.ordersService.atualizar(pedidoId, {
        status: StatusPedido.ENTREGUE,
        entregueEm: new Date(),
      });

      await this.aguardar(SIMULATION_CONFIG.MS_ENTREGA);

      if (i < viagem.ordemParadas.length - 1) {
        this.dronesService.atualizar(drone.id, { status: DroneStatus.EM_VOO });
      }
    }

    // 3. Retornando à base
    this.dronesService.atualizar(drone.id, { status: DroneStatus.RETORNANDO });
    await this.voarAte(drone.id, posicaoAtual, BASE);
    bateria = this.batteryService.consumirTrecho(
      drone.id,
      bateria,
      viagem.distanciaTotalKm,
      numeroDeTrechos,
    );

    const statusFinal =
      bateria <= this.batteryService.limiarBateriaBaixa()
        ? DroneStatus.BATERIA_BAIXA
        : DroneStatus.IDLE;

    const droneAtual = this.dronesService.buscarPorId(drone.id);
    this.dronesService.atualizar(drone.id, {
      status: statusFinal,
      posicaoAtual: { ...BASE },
      baseriaPercentual: 100, // drone recarrega automaticamente ao pousar na base
      legAtual: undefined,
      viagemAtualId: undefined,
      totalEntregasRealizadas:
        droneAtual.totalEntregasRealizadas + viagem.pedidoIds.length,
      totalDistanciaPercorridaKm:
        droneAtual.totalDistanciaPercorridaKm + viagem.distanciaTotalKm,
    });

    // Se pousou com bateria baixa, simula o tempo de recarga antes de ficar Idle novamente.
    if (statusFinal === DroneStatus.BATERIA_BAIXA) {
      await this.aguardar(SIMULATION_CONFIG.MS_CARREGAMENTO);
      this.dronesService.atualizar(drone.id, { status: DroneStatus.IDLE });
    }

    this.viagensService.atualizar(viagem.id, {
      status: StatusViagem.CONCLUIDA,
      concluidaEm: new Date(),
    });
  }

  private async voarAte(
    droneId: string,
    de: Coordenada,
    para: Coordenada,
  ): Promise<void> {
    const distanciaTrecho = distanciaEuclidiana(de, para);
    const duracaoMs = distanciaTrecho * SIMULATION_CONFIG.MS_POR_KM;

    this.dronesService.atualizar(droneId, {
      legAtual: { de, para, inicioEm: new Date(), duracaoMs },
    });

    await this.aguardar(duracaoMs);
  }

  private aguardar(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, Math.max(0, ms)));
  }
}
