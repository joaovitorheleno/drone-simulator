import { Injectable } from '@nestjs/common';
import { Drone, BASE } from '../drones/interfaces/drone.interface';
import { Coordenada, Pedido } from '../orders/interfaces/pedido.interface';
import { PESO_PRIORIDADE } from '../common/enums/prioridade.enum';
import { Obstaculo } from './interfaces/obstaculo.interface';
import { distanciaTotalRota } from './utils/geo.util';

export interface ViagemPlanejada {
  droneId: string;
  pedidos: Pedido[];
  ordemParadas: Coordenada[];
  pesoTotalKg: number;
  distanciaTotalKm: number;
}

export interface ResultadoAlocacao {
  viagens: ViagemPlanejada[];
  naoAlocados: { pedido: Pedido; motivo: string }[];
}

@Injectable()
export class AllocationService {
  otimizarAlocacao(
    pedidosPendentes: Pedido[],
    dronesDisponiveis: Drone[],
    obstaculos: Obstaculo[] = [],
  ): ResultadoAlocacao {
    const viagens: ViagemPlanejada[] = [];
    const naoAlocados: { pedido: Pedido; motivo: string }[] = [];

    const pendentes = [...pedidosPendentes].sort((a, b) => {
      const prioridadeDiff =
        PESO_PRIORIDADE[b.prioridade] - PESO_PRIORIDADE[a.prioridade];
      if (prioridadeDiff !== 0) return prioridadeDiff;
      return this.distanciaBase(a) - this.distanciaBase(b);
    });

    const drones = [...dronesDisponiveis].sort(
      (a, b) => b.capacidadeKg - a.capacidadeKg,
    );

    const alocadosNestaRodada = new Set<string>();

    for (const drone of drones) {
      if (pendentes.every((p) => alocadosNestaRodada.has(p.id))) break;

      const viagem = this.montarViagemParaDrone(
        drone,
        pendentes.filter((p) => !alocadosNestaRodada.has(p.id)),
        obstaculos,
      );

      if (viagem.pedidos.length > 0) {
        viagens.push(viagem);
        viagem.pedidos.forEach((p) => alocadosNestaRodada.add(p.id));
      }
    }

    for (const pedido of pendentes) {
      if (alocadosNestaRodada.has(pedido.id)) continue;

      const cabeEmAlgumDrone = dronesDisponiveis.some(
        (d) => d.capacidadeKg >= pedido.pesoKg,
      );
      const dentroDoAlcanceDeAlgumDrone = dronesDisponiveis.some(
        (d) => distanciaTotalRota(BASE, [pedido.cliente], obstaculos) <= d.autonomiaKm,
      );

      let motivo = 'Nenhum drone disponível no momento para esta entrega.';
      if (!cabeEmAlgumDrone) {
        motivo = `Peso do pacote (${pedido.pesoKg}kg) excede a capacidade de todos os drones da frota.`;
      } else if (!dentroDoAlcanceDeAlgumDrone) {
        motivo = 'Distância até o cliente excede a autonomia de todos os drones da frota.';
      }

      naoAlocados.push({ pedido, motivo });
    }

    return { viagens, naoAlocados };
  }

  private montarViagemParaDrone(
    drone: Drone,
    candidatos: Pedido[],
    obstaculos: Obstaculo[],
  ): ViagemPlanejada {
    const pedidosNaViagem: Pedido[] = [];
    let ordemParadas: Coordenada[] = [];
    let pesoTotalKg = 0;
    let distanciaTotalKm = 0;

    for (const pedido of candidatos) {
      const novoPeso = pesoTotalKg + pedido.pesoKg;
      if (novoPeso > drone.capacidadeKg) continue;

      const { melhorRota, melhorDistancia } = this.melhorInsercao(
        ordemParadas,
        pedido.cliente,
        obstaculos,
      );

      if (melhorDistancia > drone.autonomiaKm) continue;

      ordemParadas = melhorRota;
      pesoTotalKg = novoPeso;
      distanciaTotalKm = melhorDistancia;
      pedidosNaViagem.push(pedido);
    }

    return {
      droneId: drone.id,
      pedidos: pedidosNaViagem,
      ordemParadas,
      pesoTotalKg,
      distanciaTotalKm,
    };
  }

  /** Testa inserir `novoPonto` em cada posição possível da rota e devolve a de menor distância total. */
  private melhorInsercao(
    rotaAtual: Coordenada[],
    novoPonto: Coordenada,
    obstaculos: Obstaculo[],
  ): { melhorRota: Coordenada[]; melhorDistancia: number } {
    let melhorRota: Coordenada[] = [...rotaAtual, novoPonto];
    let melhorDistancia = distanciaTotalRota(BASE, melhorRota, obstaculos);

    for (let i = 0; i <= rotaAtual.length; i++) {
      const candidata = [
        ...rotaAtual.slice(0, i),
        novoPonto,
        ...rotaAtual.slice(i),
      ];
      const distancia = distanciaTotalRota(BASE, candidata, obstaculos);
      if (distancia < melhorDistancia) {
        melhorDistancia = distancia;
        melhorRota = candidata;
      }
    }

    return { melhorRota, melhorDistancia };
  }

  private distanciaBase(pedido: Pedido): number {
    return Math.hypot(pedido.cliente.x, pedido.cliente.y);
  }
}
