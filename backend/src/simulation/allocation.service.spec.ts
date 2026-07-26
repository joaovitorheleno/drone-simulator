import { AllocationService } from './allocation.service';
import { Drone, BASE } from '../drones/interfaces/drone.interface';
import { DroneStatus } from '../common/enums/drone-status.enum';
import { Pedido, StatusPedido } from '../orders/interfaces/pedido.interface';
import { Prioridade } from '../common/enums/prioridade.enum';

function criarDrone(overrides: Partial<Drone> = {}): Drone {
  return {
    id: overrides.id ?? 'drone-1',
    nome: overrides.nome ?? 'Drone-Teste',
    capacidadeKg: overrides.capacidadeKg ?? 10,
    autonomiaKm: overrides.autonomiaKm ?? 20,
    status: DroneStatus.IDLE,
    posicaoAtual: { ...BASE },
    baseriaPercentual: 100,
    totalEntregasRealizadas: 0,
    totalDistanciaPercorridaKm: 0,
    atualizadoEm: new Date(),
    ...overrides,
  };
}

function criarPedido(overrides: Partial<Pedido> = {}): Pedido {
  return {
    id: overrides.id ?? 'pedido-1',
    cliente: overrides.cliente ?? { x: 3, y: 4 },
    pesoKg: overrides.pesoKg ?? 2,
    prioridade: overrides.prioridade ?? Prioridade.MEDIA,
    status: StatusPedido.PENDENTE,
    criadoEm: new Date(),
    ...overrides,
  };
}

describe('AllocationService', () => {
  let service: AllocationService;

  beforeEach(() => {
    service = new AllocationService();
  });

  it('aloca um único pedido dentro da capacidade e autonomia do drone', () => {
    const drone = criarDrone({ capacidadeKg: 10, autonomiaKm: 20 });
    const pedido = criarPedido({ pesoKg: 5, cliente: { x: 3, y: 4 } }); // distância base->cliente->base = 10km

    const resultado = service.otimizarAlocacao([pedido], [drone]);

    expect(resultado.naoAlocados).toHaveLength(0);
    expect(resultado.viagens).toHaveLength(1);
    expect(resultado.viagens[0].pedidos.map((p) => p.id)).toEqual([pedido.id]);
    expect(resultado.viagens[0].pesoTotalKg).toBe(5);
  });

  it('não excede a capacidade de peso do drone em uma única viagem', () => {
    const drone = criarDrone({ capacidadeKg: 5, autonomiaKm: 100 });
    const pedidos = [
      criarPedido({ id: 'p1', pesoKg: 3, cliente: { x: 1, y: 0 } }),
      criarPedido({ id: 'p2', pesoKg: 3, cliente: { x: 2, y: 0 } }),
    ];

    const resultado = service.otimizarAlocacao(pedidos, [drone]);

    const pesoAlocado = resultado.viagens.reduce(
      (acc, v) => acc + v.pesoTotalKg,
      0,
    );
    expect(pesoAlocado).toBeLessThanOrEqual(5);
    // Um dos dois pedidos não deve caber nesta única viagem (3kg + 3kg = 6kg > 5kg)
    expect(resultado.viagens[0].pedidos).toHaveLength(1);
  });

  it('não excede a autonomia (km) do drone em uma única viagem', () => {
    const drone = criarDrone({ capacidadeKg: 100, autonomiaKm: 5 });
    // distância base->cliente->base = 20km, acima da autonomia de 5km
    const pedido = criarPedido({ cliente: { x: 10, y: 0 }, pesoKg: 1 });

    const resultado = service.otimizarAlocacao([pedido], [drone]);

    expect(resultado.viagens.every((v) => v.pedidos.length === 0)).toBe(true);
    expect(resultado.naoAlocados).toHaveLength(1);
    expect(resultado.naoAlocados[0].motivo).toMatch(/autonomia/i);
  });

  it('reporta pedidos cujo peso excede a capacidade de toda a frota', () => {
    const drone = criarDrone({ capacidadeKg: 5, autonomiaKm: 100 });
    const pedido = criarPedido({ pesoKg: 50 });

    const resultado = service.otimizarAlocacao([pedido], [drone]);

    expect(resultado.naoAlocados).toHaveLength(1);
    expect(resultado.naoAlocados[0].motivo).toMatch(/capacidade/i);
  });

  it('prioriza pedidos de prioridade alta sobre os de prioridade baixa', () => {
    const drone = criarDrone({ capacidadeKg: 1, autonomiaKm: 100 });
    const baixa = criarPedido({
      id: 'baixa',
      pesoKg: 1,
      prioridade: Prioridade.BAIXA,
      cliente: { x: 1, y: 0 },
    });
    const alta = criarPedido({
      id: 'alta',
      pesoKg: 1,
      prioridade: Prioridade.ALTA,
      cliente: { x: 5, y: 0 },
    });

    // Capacidade do drone só permite 1kg por viagem: apenas um pedido cabe.
    const resultado = service.otimizarAlocacao([baixa, alta], [drone]);

    expect(resultado.viagens[0].pedidos[0].id).toBe('alta');
  });

  it('distribui pedidos entre múltiplos drones quando necessário', () => {
    const droneA = criarDrone({ id: 'a', capacidadeKg: 3, autonomiaKm: 100 });
    const droneB = criarDrone({ id: 'b', capacidadeKg: 3, autonomiaKm: 100 });
    const pedidos = [
      criarPedido({ id: 'p1', pesoKg: 3, cliente: { x: 1, y: 0 } }),
      criarPedido({ id: 'p2', pesoKg: 3, cliente: { x: 2, y: 0 } }),
    ];

    const resultado = service.otimizarAlocacao(pedidos, [droneA, droneB]);

    expect(resultado.naoAlocados).toHaveLength(0);
    expect(resultado.viagens).toHaveLength(2);
  });
});
