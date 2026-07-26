import { Coordenada } from '../../orders/interfaces/pedido.interface';

export enum StatusViagem {
  PLANEJADA = 'planejada',
  EM_ANDAMENTO = 'em_andamento',
  CONCLUIDA = 'concluida',
}

export interface Viagem {
  id: string;
  droneId: string;
  pedidoIds: string[];
  ordemParadas: Coordenada[];
  pesoTotalKg: number;
  distanciaTotalKm: number;
  status: StatusViagem;
  criadaEm: Date;
  iniciadaEm?: Date;
  concluidaEm?: Date;
  duracaoEstimadaSegundos: number;
}
