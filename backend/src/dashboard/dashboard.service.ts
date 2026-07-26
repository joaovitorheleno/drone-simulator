import { Injectable } from '@nestjs/common';
import { DronesService } from '../drones/drones.service';
import { OrdersService } from '../orders/orders.service';
import { ViagensService } from '../deliveries/viagens.service';
import { StatusPedido } from '../orders/interfaces/pedido.interface';
import { StatusViagem } from '../deliveries/interfaces/viagem.interface';

@Injectable()
export class DashboardService {
  constructor(
    private readonly dronesService: DronesService,
    private readonly ordersService: OrdersService,
    private readonly viagensService: ViagensService,
  ) {}

  obterResumo() {
    const pedidos = this.ordersService.listarTodos();
    const drones = this.dronesService.listarTodos();
    const viagens = this.viagensService.listarTodos();

    const entregues = pedidos.filter(
      (p) => p.status === StatusPedido.ENTREGUE,
    );

    const temposDeEntregaSegundos = entregues
      .filter((p) => p.entregueEm)
      .map((p) => (p.entregueEm!.getTime() - p.criadoEm.getTime()) / 1000);

    const tempoMedioPorEntregaSegundos =
      temposDeEntregaSegundos.length > 0
        ? Number(
            (
              temposDeEntregaSegundos.reduce((acc, t) => acc + t, 0) /
              temposDeEntregaSegundos.length
            ).toFixed(1),
          )
        : 0;

    const droneMaisEficiente = [...drones]
      .filter((d) => d.totalEntregasRealizadas > 0)
      .sort((a, b) => {
        const eficienciaA =
          a.totalEntregasRealizadas / Math.max(1, a.totalDistanciaPercorridaKm);
        const eficienciaB =
          b.totalEntregasRealizadas / Math.max(1, b.totalDistanciaPercorridaKm);
        return eficienciaB - eficienciaA;
      })[0];

    return {
      quantidadeEntregasRealizadas: entregues.length,
      quantidadePedidosPendentes: pedidos.filter(
        (p) => p.status === StatusPedido.PENDENTE,
      ).length,
      quantidadePedidosEmRota: pedidos.filter(
        (p) =>
          p.status === StatusPedido.ALOCADO ||
          p.status === StatusPedido.EM_ROTA,
      ).length,
      tempoMedioPorEntregaSegundos,
      droneMaisEficiente: droneMaisEficiente
        ? {
            id: droneMaisEficiente.id,
            nome: droneMaisEficiente.nome,
            totalEntregasRealizadas: droneMaisEficiente.totalEntregasRealizadas,
            totalDistanciaPercorridaKm: Number(
              droneMaisEficiente.totalDistanciaPercorridaKm.toFixed(2),
            ),
          }
        : null,
      viagensEmAndamento: viagens.filter(
        (v) => v.status === StatusViagem.EM_ANDAMENTO,
      ).length,
      viagensConcluidas: viagens.filter(
        (v) => v.status === StatusViagem.CONCLUIDA,
      ).length,
      mapaEntregas: pedidos.map((p) => ({
        id: p.id,
        x: p.cliente.x,
        y: p.cliente.y,
        status: p.status,
        prioridade: p.prioridade,
      })),
    };
  }
}
