import { Coordenada } from '../../orders/interfaces/pedido.interface';
import { Obstaculo } from '../interfaces/obstaculo.interface';

/** Distância euclidiana simples entre dois pontos (km, já que a malha é 1 unidade = 1 km). */
export function distanciaEuclidiana(a: Coordenada, b: Coordenada): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

/**
 * Verifica se o segmento de reta entre `a` e `b` cruza o círculo do obstáculo.
 * Usa a projeção do centro do círculo sobre o segmento (distância ponto-segmento).
 */
function segmentoCruzaObstaculo(
  a: Coordenada,
  b: Coordenada,
  obstaculo: Obstaculo,
): boolean {
  const { centro, raioKm } = obstaculo;
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const comprimentoQuadrado = dx * dx + dy * dy;

  if (comprimentoQuadrado === 0) {
    return distanciaEuclidiana(a, centro) <= raioKm;
  }

  // t = posição da projeção do centro no segmento, limitada a [0,1]
  let t = ((centro.x - a.x) * dx + (centro.y - a.y) * dy) / comprimentoQuadrado;
  t = Math.max(0, Math.min(1, t));

  const projecao: Coordenada = { x: a.x + t * dx, y: a.y + t * dy };
  return distanciaEuclidiana(projecao, centro) <= raioKm;
}

/**
 * Calcula a distância de voo entre dois pontos considerando zonas de exclusão aérea.
 * Se o caminho direto cruza algum obstáculo, simula um desvio (detour) contornando
 * a borda do círculo, o que acrescenta uma penalidade de distância proporcional ao raio.
 */
export function distanciaComObstaculos(
  a: Coordenada,
  b: Coordenada,
  obstaculos: Obstaculo[] = [],
): number {
  const direta = distanciaEuclidiana(a, b);
  const obstaculoBloqueando = obstaculos.find((o) =>
    segmentoCruzaObstaculo(a, b, o),
  );

  if (!obstaculoBloqueando) {
    return direta;
  }

  // Penalidade heurística de desvio: metade do perímetro do círculo (contornar a zona),
  // um cálculo simples e determinístico o suficiente para o propósito da simulação.
  const penalidadeDesvio = Math.PI * obstaculoBloqueando.raioKm;
  return direta + penalidadeDesvio;
}

/** Interpola a posição atual de um drone dado o início/fim de um trecho e o tempo decorrido. */
export function interpolarPosicao(
  de: Coordenada,
  para: Coordenada,
  fracaoConcluida: number,
): Coordenada {
  const t = Math.max(0, Math.min(1, fracaoConcluida));
  return {
    x: de.x + (para.x - de.x) * t,
    y: de.y + (para.y - de.y) * t,
  };
}

/** Calcula a distância total de uma rota fechada partindo e retornando à base. */
export function distanciaTotalRota(
  base: Coordenada,
  paradas: Coordenada[],
  obstaculos: Obstaculo[] = [],
): number {
  const pontos = [base, ...paradas, base];
  let total = 0;
  for (let i = 0; i < pontos.length - 1; i++) {
    total += distanciaComObstaculos(pontos[i], pontos[i + 1], obstaculos);
  }
  return total;
}
