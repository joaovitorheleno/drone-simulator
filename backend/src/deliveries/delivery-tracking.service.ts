import { Injectable } from '@nestjs/common';
import { OrdersService } from '../orders/orders.service';
import { DronesService } from '../drones/drones.service';
import { DroneStatus } from '../common/enums/drone-status.enum';
import { Drone } from '../drones/interfaces/drone.interface';
import { distanciaEuclidiana, interpolarPosicao } from '../simulation/utils/geo.util';

@Injectable()
export class DeliveryTrackingService {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly dronesService: DronesService,
  ) {}

  estimarDistanciaRestante(pedidoId: string): {
    faltamKm: number;
    statusDrone?: DroneStatus;
  } | null {
    const pedido = this.ordersService.buscarPorId(pedidoId);
    if (!pedido.droneId) return null;

    const drone = this.dronesService.buscarPorId(pedido.droneId);
    const posicaoAtual = this.posicaoInterpoladaAtual(drone);
    const faltamKm = distanciaEuclidiana(posicaoAtual, pedido.cliente);

    return { faltamKm: Number(faltamKm.toFixed(2)), statusDrone: drone.status };
  }

  private posicaoInterpoladaAtual(drone: Drone) {
    if (!drone.legAtual) return drone.posicaoAtual;
    const decorridoMs = Date.now() - drone.legAtual.inicioEm.getTime();
    const fracao = drone.legAtual.duracaoMs
      ? decorridoMs / drone.legAtual.duracaoMs
      : 1;
    return interpolarPosicao(drone.legAtual.de, drone.legAtual.para, fracao);
  }
}
