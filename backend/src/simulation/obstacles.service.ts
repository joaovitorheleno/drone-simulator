import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { Obstaculo } from './interfaces/obstaculo.interface';
import { CreateObstaculoDto } from './dto/create-obstaculo.dto';

@Injectable()
export class ObstaclesService {
  private readonly obstaculos = new Map<string, Obstaculo>();

  criar(dto: CreateObstaculoDto): Obstaculo {
    const obstaculo: Obstaculo = { id: uuid(), ...dto };
    this.obstaculos.set(obstaculo.id, obstaculo);
    return obstaculo;
  }

  listarTodos(): Obstaculo[] {
    return Array.from(this.obstaculos.values());
  }

  remover(id: string): void {
    if (!this.obstaculos.has(id)) {
      throw new NotFoundException(`Obstáculo ${id} não encontrado`);
    }
    this.obstaculos.delete(id);
  }
}
