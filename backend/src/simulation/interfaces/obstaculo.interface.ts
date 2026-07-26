import { Coordenada } from '../../orders/interfaces/pedido.interface';

export interface Obstaculo {
  id: string;
  nome: string;
  centro: Coordenada;
  raioKm: number;
}
