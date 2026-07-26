export type Prioridade = 'baixa' | 'media' | 'alta';

export type StatusPedido = 'pendente' | 'alocado' | 'em_rota' | 'entregue';

export type DroneStatus =
  | 'idle'
  | 'carregando'
  | 'em_voo'
  | 'entregando'
  | 'retornando'
  | 'bateria_baixa';

export type StatusViagem = 'planejada' | 'em_andamento' | 'concluida';

export interface Coordenada {
  x: number;
  y: number;
}

export interface Pedido {
  id: string;
  cliente: Coordenada;
  pesoKg: number;
  prioridade: Prioridade;
  status: StatusPedido;
  criadoEm: string;
  entregueEm?: string;
  droneId?: string;
  viagemId?: string;
}

export interface Drone {
  id: string;
  nome: string;
  capacidadeKg: number;
  autonomiaKm: number;
  status: DroneStatus;
  posicaoAtual: Coordenada;
  baseriaPercentual: number;
  viagemAtualId?: string;
  totalEntregasRealizadas: number;
  totalDistanciaPercorridaKm: number;
  atualizadoEm: string;
  legAtual?: {
    de: Coordenada;
    para: Coordenada;
    inicioEm: string;
    duracaoMs: number;
  };
}

export interface Viagem {
  id: string;
  droneId: string;
  pedidoIds: string[];
  ordemParadas: Coordenada[];
  pesoTotalKg: number;
  distanciaTotalKm: number;
  status: StatusViagem;
  criadaEm: string;
  iniciadaEm?: string;
  concluidaEm?: string;
  duracaoEstimadaSegundos: number;
}

export interface Obstaculo {
  id: string;
  nome: string;
  centro: Coordenada;
  raioKm: number;
}

export interface DashboardResumo {
  quantidadeEntregasRealizadas: number;
  quantidadePedidosPendentes: number;
  quantidadePedidosEmRota: number;
  tempoMedioPorEntregaSegundos: number;
  droneMaisEficiente: {
    id: string;
    nome: string;
    totalEntregasRealizadas: number;
    totalDistanciaPercorridaKm: number;
  } | null;
  viagensEmAndamento: number;
  viagensConcluidas: number;
  mapaEntregas: {
    id: string;
    x: number;
    y: number;
    status: StatusPedido;
    prioridade: Prioridade;
  }[];
}

export interface NovoPedidoInput {
  cliente: Coordenada;
  pesoKg: number;
  prioridade: Prioridade;
}

export interface NovoDroneInput {
  nome?: string;
  capacidadeKg: number;
  autonomiaKm: number;
}
