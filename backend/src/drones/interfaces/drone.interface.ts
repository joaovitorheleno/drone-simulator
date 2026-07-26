import { DroneStatus } from '../../common/enums/drone-status.enum';
import { Coordenada } from '../../orders/interfaces/pedido.interface';

export interface Drone {
  id: string;
  nome: string;
  capacidadeKg: number;
  autonomiaKm: number;
  status: DroneStatus;
  posicaoAtual: Coordenada;
  baseriaPercentual: number; 
  viagemAtualId?: string;
  distanciaRestanteKm?: number; 
  totalEntregasRealizadas: number;
  totalDistanciaPercorridaKm: number;
  atualizadoEm: Date;
  legAtual?: {
    de: Coordenada;
    para: Coordenada;
    inicioEm: Date;
    duracaoMs: number;
  };
}

export const BASE: Coordenada = { x: 0, y: 0 };
