export enum Prioridade {
  BAIXA = 'baixa',
  MEDIA = 'media',
  ALTA = 'alta',
}

export const PESO_PRIORIDADE: Record<Prioridade, number> = {
  [Prioridade.ALTA]: 3,
  [Prioridade.MEDIA]: 2,
  [Prioridade.BAIXA]: 1,
};
