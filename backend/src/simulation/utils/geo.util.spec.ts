import {
  distanciaEuclidiana,
  distanciaComObstaculos,
  distanciaTotalRota,
} from './geo.util';
import { Obstaculo } from '../interfaces/obstaculo.interface';

describe('geo.util', () => {
  it('calcula a distância euclidiana entre dois pontos', () => {
    expect(distanciaEuclidiana({ x: 0, y: 0 }, { x: 3, y: 4 })).toBe(5);
  });

  it('não penaliza a distância quando não há obstáculo no caminho', () => {
    const distancia = distanciaComObstaculos({ x: 0, y: 0 }, { x: 10, y: 0 }, []);
    expect(distancia).toBe(10);
  });

  it('penaliza a distância quando o caminho cruza uma zona de exclusão aérea', () => {
    const obstaculo: Obstaculo = {
      id: 'zona-1',
      nome: 'Aeroporto',
      centro: { x: 5, y: 0 },
      raioKm: 2,
    };

    const distanciaDireta = distanciaEuclidiana({ x: 0, y: 0 }, { x: 10, y: 0 });
    const distanciaComDesvio = distanciaComObstaculos(
      { x: 0, y: 0 },
      { x: 10, y: 0 },
      [obstaculo],
    );

    expect(distanciaComDesvio).toBeGreaterThan(distanciaDireta);
  });

  it('calcula a distância total de uma rota fechada (base -> paradas -> base)', () => {
    const total = distanciaTotalRota(
      { x: 0, y: 0 },
      [
        { x: 3, y: 0 },
        { x: 3, y: 4 },
      ],
      [],
    );
    // base->(3,0) = 3, (3,0)->(3,4) = 4, (3,4)->base = 5
    expect(total).toBe(12);
  });
});
