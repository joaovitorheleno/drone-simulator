import { Injectable } from '@nestjs/common';
import { DronesService } from '../drones/drones.service';
import { SIMULATION_CONFIG } from './simulation.config';

@Injectable()
export class BatteryService {
  constructor(private readonly dronesService: DronesService) {}

  calcularConsumoPorTrecho(
    droneId: string,
    distanciaTotalViagemKm: number,
    numeroDeTrechos: number,
  ): number {
    const drone = this.dronesService.buscarPorId(droneId);
    const consumoTotalDaViagem =
      distanciaTotalViagemKm > 0
        ? (distanciaTotalViagemKm / drone.autonomiaKm) * 100
        : 0;
    return numeroDeTrechos > 0 ? consumoTotalDaViagem / numeroDeTrechos : 0;
  }

  consumirTrecho(
    droneId: string,
    bateriaAtual: number,
    distanciaTotalViagemKm: number,
    numeroDeTrechos: number,
  ): number {
    const consumo = this.calcularConsumoPorTrecho(
      droneId,
      distanciaTotalViagemKm,
      numeroDeTrechos,
    );
    const novaBateria = Math.max(0, bateriaAtual - consumo);
    this.dronesService.atualizar(droneId, {
      baseriaPercentual: Math.round(novaBateria),
    });
    return novaBateria;
  }

  limiarBateriaBaixa(): number {
    return SIMULATION_CONFIG.LIMIAR_BATERIA_BAIXA;
  }
}
