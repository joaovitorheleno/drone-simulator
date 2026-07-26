export const SIMULATION_CONFIG = {
  /** Tempo (ms) parado na base preparando/carregando o drone antes da decolagem. */
  MS_CARREGAMENTO: Number(process.env.SIM_MS_CARREGAMENTO ?? 2000),
  /** Tempo (ms) de voo simulado para cada 1km percorrido. */
  MS_POR_KM: Number(process.env.SIM_MS_POR_KM ?? 400),
  /** Tempo (ms) parado em cada parada realizando a entrega. */
  MS_ENTREGA: Number(process.env.SIM_MS_ENTREGA ?? 1200),
  /** Percentual de bateria abaixo do qual o drone é sinalizado como "bateria baixa". */
  LIMIAR_BATERIA_BAIXA: Number(process.env.SIM_LIMIAR_BATERIA_BAIXA ?? 15),
  /** Intervalo (ms) do processamento automático da fila de pedidos pendentes. */
  MS_INTERVALO_FILA: Number(process.env.SIM_MS_INTERVALO_FILA ?? 3000),
};
