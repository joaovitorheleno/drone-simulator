import { Prioridade } from '../../common/enums/prioridade.enum';

export interface Coordenada {
  x: number;
  y: number;
}

export enum StatusPedido {
  PENDENTE = 'pendente',
  ALOCADO = 'alocado',
  EM_ROTA = 'em_rota',
  ENTREGUE = 'entregue',
}

export interface Pedido {
  id: string;
  cliente: Coordenada;
  pesoKg: number;
  prioridade: Prioridade;
  status: StatusPedido;
  criadoEm: Date;
  entregueEm?: Date;
  droneId?: string;
  viagemId?: string;
}
