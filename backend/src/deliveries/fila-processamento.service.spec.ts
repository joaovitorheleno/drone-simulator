import { Test } from '@nestjs/testing';

process.env.SIM_MS_CARREGAMENTO = '10';
process.env.SIM_MS_POR_KM = '2';
process.env.SIM_MS_ENTREGA = '10';
process.env.SIM_MS_INTERVALO_FILA = '50000';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { DronesModule } = require('../drones/drones.module');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { OrdersModule } = require('../orders/orders.module');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { DeliveriesModule } = require('./deliveries.module');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { DronesService } = require('../drones/drones.service');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { OrdersService } = require('../orders/orders.service');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { FilaProcessamentoService } = require('./fila-processamento.service');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { ViagensService } = require('./viagens.service');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { DeliveryTrackingService } = require('./delivery-tracking.service');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { Prioridade } = require('../common/enums/prioridade.enum');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { StatusPedido } = require('../orders/interfaces/pedido.interface');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { DroneStatus } = require('../common/enums/drone-status.enum');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { StatusViagem } = require('./interfaces/viagem.interface');

describe('Fila de entregas (serviços separados por responsabilidade)', () => {
  jest.setTimeout(15000);

  it('FilaProcessamentoService aloca e o DroneFlightService leva o pedido até "entregue"', async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [DronesModule, OrdersModule, DeliveriesModule],
    }).compile();

    const app = moduleRef.createNestApplication();
    await app.init();

    const ordersService = moduleRef.get(OrdersService);
    const filaProcessamentoService = moduleRef.get(FilaProcessamentoService);
    const viagensService = moduleRef.get(ViagensService);
    const dronesService = moduleRef.get(DronesService);
    const deliveryTrackingService = moduleRef.get(DeliveryTrackingService);

    const pedido = ordersService.criar({
      cliente: { x: 2, y: 0 },
      pesoKg: 1,
      prioridade: Prioridade.ALTA,
    });

    await filaProcessamentoService.processarFila();

    const pedidoAlocado = ordersService.buscarPorId(pedido.id);
    expect(pedidoAlocado.status).toBe(StatusPedido.ALOCADO);
    expect(pedidoAlocado.droneId).toBeDefined();
    expect(pedidoAlocado.viagemId).toBeDefined();

    const viagem = viagensService.buscarPorId(pedidoAlocado.viagemId);
    expect(viagem).toBeDefined();
    expect([StatusViagem.PLANEJADA, StatusViagem.EM_ANDAMENTO]).toContain(
      viagem.status,
    );

    const droneEmUso = dronesService.buscarPorId(pedidoAlocado.droneId);
    expect([DroneStatus.CARREGANDO, DroneStatus.EM_VOO]).toContain(
      droneEmUso.status,
    );

    const statusEntrega = deliveryTrackingService.estimarDistanciaRestante(
      pedido.id,
    );
    expect(statusEntrega).not.toBeNull();
    expect(statusEntrega!.faltamKm).toBeGreaterThanOrEqual(0);
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const pedidoFinal = ordersService.buscarPorId(pedido.id);
    expect(pedidoFinal.status).toBe(StatusPedido.ENTREGUE);
    expect(pedidoFinal.entregueEm).toBeDefined();

    const viagemFinal = viagensService.buscarPorId(pedidoAlocado.viagemId);
    expect(viagemFinal.status).toBe(StatusViagem.CONCLUIDA);
    expect(viagemFinal.concluidaEm).toBeDefined();

    const droneFinal = dronesService.buscarPorId(pedidoAlocado.droneId);
    expect(droneFinal.status).toBe(DroneStatus.IDLE);
    expect(droneFinal.totalEntregasRealizadas).toBeGreaterThanOrEqual(1);

    await app.close();
  });

  it('rejeita pedido com peso inválido através do DTO (validação)', async () => {
    const { CreatePedidoDto } = require('../orders/dto/create-pedido.dto');
    const { validate } = require('class-validator');
    const { plainToInstance } = require('class-transformer');

    const dto = plainToInstance(CreatePedidoDto, {
      cliente: { x: 1, y: 1 },
      pesoKg: -5,
      prioridade: 'alta',
    });

    const erros = await validate(dto);
    expect(erros.length).toBeGreaterThan(0);
  });
});
