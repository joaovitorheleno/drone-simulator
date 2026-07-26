import type {
  Drone,
  Pedido,
  Viagem,
  Obstaculo,
  DashboardResumo,
  NovoPedidoInput,
  NovoDroneInput,
} from '../types';

const BASE_URL = '/api';

class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  if (!response.ok) {
    const corpo = await response.json().catch(() => ({}));
    const mensagem =
      corpo?.mensagem ?? corpo?.message ?? `Erro ${response.status}`;
    throw new ApiError(
      Array.isArray(mensagem) ? mensagem.join(', ') : mensagem,
      response.status,
    );
  }

  if (response.status === 204) return undefined as T;
  return response.json();
}

export const api = {
  listarPedidos: () => request<Pedido[]>('/pedidos'),
  criarPedido: (input: NovoPedidoInput) =>
    request<Pedido>('/pedidos', {
      method: 'POST',
      body: JSON.stringify(input),
    }),
  statusEntrega: (pedidoId: string) =>
    request<{ faltamKm: number; statusDrone?: string } | null>(
      `/entregas/${pedidoId}/status`,
    ),

  listarDrones: () => request<Drone[]>('/drones/status'),
  criarDrone: (input: NovoDroneInput) =>
    request<Drone>('/drones', {
      method: 'POST',
      body: JSON.stringify(input),
    }),

  listarRotas: () => request<Viagem[]>('/entregas/rota'),

  listarObstaculos: () => request<Obstaculo[]>('/obstaculos'),
  criarObstaculo: (input: Omit<Obstaculo, 'id'>) =>
    request<Obstaculo>('/obstaculos', {
      method: 'POST',
      body: JSON.stringify(input),
    }),
  removerObstaculo: (id: string) =>
    request<{ removido: boolean }>(`/obstaculos/${id}`, {
      method: 'DELETE',
    }),

  obterDashboard: () => request<DashboardResumo>('/dashboard'),
};

export { ApiError };
