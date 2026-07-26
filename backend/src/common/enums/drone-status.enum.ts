export enum DroneStatus {
  IDLE = 'idle',
  CARREGANDO = 'carregando',
  EM_VOO = 'em_voo',
  ENTREGANDO = 'entregando',
  RETORNANDO = 'retornando',
  BATERIA_BAIXA = 'bateria_baixa', 
}

export const TRANSICOES_VALIDAS: Record<DroneStatus, DroneStatus[]> = {
  [DroneStatus.IDLE]: [DroneStatus.CARREGANDO],
  [DroneStatus.CARREGANDO]: [DroneStatus.EM_VOO],
  [DroneStatus.EM_VOO]: [DroneStatus.ENTREGANDO, DroneStatus.BATERIA_BAIXA],
  [DroneStatus.ENTREGANDO]: [DroneStatus.RETORNANDO],
  [DroneStatus.RETORNANDO]: [DroneStatus.IDLE, DroneStatus.BATERIA_BAIXA],
  [DroneStatus.BATERIA_BAIXA]: [DroneStatus.CARREGANDO],
};
