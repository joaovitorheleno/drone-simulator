import { BatteryService } from './battery.service';
import { DronesService } from '../drones/drones.service';

describe('BatteryService', () => {
  let dronesService: DronesService;
  let batteryService: BatteryService;
  let droneId: string;

  beforeEach(() => {
    dronesService = new DronesService();
    batteryService = new BatteryService(dronesService);
    droneId = dronesService.listarTodos()[0].id;
    dronesService.atualizar(droneId, { autonomiaKm: 20 });
  });

  it('calcula o consumo por trecho proporcional à distância e à autonomia', () => {
    const consumo = batteryService.calcularConsumoPorTrecho(droneId, 10, 2);
    expect(consumo).toBeCloseTo(25, 5);
  });

  it('não consome bateria quando a distância da viagem é zero', () => {
    const consumo = batteryService.calcularConsumoPorTrecho(droneId, 0, 1);
    expect(consumo).toBe(0);
  });

  it('aplica o consumo e persiste o novo percentual no drone', () => {
    const restante = batteryService.consumirTrecho(droneId, 100, 10, 2);
    expect(restante).toBeCloseTo(75, 5);

    const drone = dronesService.buscarPorId(droneId);
    expect(drone.baseriaPercentual).toBe(75);
  });

  it('nunca deixa a bateria ficar negativa', () => {
    const restante = batteryService.consumirTrecho(droneId, 10, 1000, 1);
    expect(restante).toBe(0);

    const drone = dronesService.buscarPorId(droneId);
    expect(drone.baseriaPercentual).toBe(0);
  });

  it('expõe o limiar de bateria baixa configurado', () => {
    expect(batteryService.limiarBateriaBaixa()).toBeGreaterThanOrEqual(0);
  });
});
