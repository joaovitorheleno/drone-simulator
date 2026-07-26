import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { Pedido, StatusPedido } from './interfaces/pedido.interface';
import { CreatePedidoDto } from './dto/create-pedido.dto';

@Injectable()
export class OrdersService {
  private readonly pedidos = new Map<string, Pedido>();

  criar(dto: CreatePedidoDto): Pedido {
    const pedido: Pedido = {
      id: uuid(),
      cliente: { x: dto.cliente.x, y: dto.cliente.y },
      pesoKg: dto.pesoKg,
      prioridade: dto.prioridade,
      status: StatusPedido.PENDENTE,
      criadoEm: new Date(),
    };
    this.pedidos.set(pedido.id, pedido);
    return pedido;
  }

  listarTodos(): Pedido[] {
    return Array.from(this.pedidos.values()).sort(
      (a, b) => b.criadoEm.getTime() - a.criadoEm.getTime(),
    );
  }

  listarPendentes(): Pedido[] {
    return this.listarTodos().filter(
      (p) => p.status === StatusPedido.PENDENTE,
    );
  }

  buscarPorId(id: string): Pedido {
    const pedido = this.pedidos.get(id);
    if (!pedido) {
      throw new NotFoundException(`Pedido ${id} não encontrado`);
    }
    return pedido;
  }

  atualizar(id: string, alteracoes: Partial<Pedido>): Pedido {
    const pedido = this.buscarPorId(id);
    const atualizado = { ...pedido, ...alteracoes };
    this.pedidos.set(id, atualizado);
    return atualizado;
  }
}
