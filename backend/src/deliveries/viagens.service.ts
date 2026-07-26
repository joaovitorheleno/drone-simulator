import { Injectable, NotFoundException } from '@nestjs/common';
import { Viagem } from './interfaces/viagem.interface';

@Injectable()
export class ViagensService {
  private readonly viagens = new Map<string, Viagem>();

  criar(viagem: Viagem): Viagem {
    this.viagens.set(viagem.id, viagem);
    return viagem;
  }

  listarTodos(): Viagem[] {
    return Array.from(this.viagens.values()).sort(
      (a, b) => b.criadaEm.getTime() - a.criadaEm.getTime(),
    );
  }

  buscarPorId(id: string): Viagem {
    const viagem = this.viagens.get(id);
    if (!viagem) {
      throw new NotFoundException(`Viagem ${id} não encontrada`);
    }
    return viagem;
  }

  atualizar(id: string, alteracoes: Partial<Viagem>): Viagem {
    const viagem = this.buscarPorId(id);
    const atualizada = { ...viagem, ...alteracoes };
    this.viagens.set(id, atualizada);
    return atualizada;
  }
}
