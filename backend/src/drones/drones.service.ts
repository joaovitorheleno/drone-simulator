import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { Drone, BASE } from './interfaces/drone.interface';
import { DroneStatus } from '../common/enums/drone-status.enum';
import { CreateDroneDto } from './dto/create-drone.dto';

@Injectable()
export class DronesService {
  private readonly drones = new Map<string, Drone>();

  constructor() {
    this.criar({ nome: 'Drone-01', capacidadeKg: 10, autonomiaKm: 25 });
    this.criar({ nome: 'Drone-02', capacidadeKg: 5, autonomiaKm: 15 });
    this.criar({ nome: 'Drone-03', capacidadeKg: 15, autonomiaKm: 40 });
  }

  criar(dto: CreateDroneDto): Drone {
    const drone: Drone = {
      id: uuid(),
      nome: dto.nome ?? `Drone-${this.drones.size + 1}`,
      capacidadeKg: dto.capacidadeKg,
      autonomiaKm: dto.autonomiaKm,
      status: DroneStatus.IDLE,
      posicaoAtual: { ...BASE },
      baseriaPercentual: 100,
      totalEntregasRealizadas: 0,
      totalDistanciaPercorridaKm: 0,
      atualizadoEm: new Date(),
    };
    this.drones.set(drone.id, drone);
    return drone;
  }

  listarTodos(): Drone[] {
    return Array.from(this.drones.values()).sort((a, b) =>
      a.nome.localeCompare(b.nome),
    );
  }

  listarDisponiveis(): Drone[] {
    return this.listarTodos().filter((d) => d.status === DroneStatus.IDLE);
  }

  buscarPorId(id: string): Drone {
    const drone = this.drones.get(id);
    if (!drone) {
      throw new NotFoundException(`Drone ${id} não encontrado`);
    }
    return drone;
  }

  atualizar(id: string, alteracoes: Partial<Drone>): Drone {
    const drone = this.buscarPorId(id);
    const atualizado = { ...drone, ...alteracoes, atualizadoEm: new Date() };
    this.drones.set(id, atualizado);
    return atualizado;
  }

  remover(id: string): void {
    this.buscarPorId(id);
    this.drones.delete(id);
  }
}
