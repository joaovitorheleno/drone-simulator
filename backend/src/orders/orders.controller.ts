import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { FilaProcessamentoService } from '../deliveries/fila-processamento.service';

@ApiTags('pedidos')
@Controller('pedidos')
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly filaProcessamentoService: FilaProcessamentoService,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Cria um novo pedido de entrega e dispara a alocação em drones',
  })
  async criar(@Body() dto: CreatePedidoDto) {
    const pedido = this.ordersService.criar(dto);
    await this.filaProcessamentoService.processarFila();
    return this.ordersService.buscarPorId(pedido.id);
  }

  @Get()
  @ApiOperation({ summary: 'Lista todos os pedidos' })
  listar() {
    return this.ordersService.listarTodos();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Busca um pedido pelo id' })
  buscarPorId(@Param('id') id: string) {
    return this.ordersService.buscarPorId(id);
  }
}
