import { Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ViagensService } from './viagens.service';
import { DeliveryTrackingService } from './delivery-tracking.service';
import { FilaProcessamentoService } from './fila-processamento.service';

@ApiTags('entregas')
@Controller('entregas')
export class DeliveriesController {
  constructor(
    private readonly viagensService: ViagensService,
    private readonly deliveryTrackingService: DeliveryTrackingService,
    private readonly filaProcessamentoService: FilaProcessamentoService,
  ) {}

  @Get('rota')
  @ApiOperation({
    summary:
      'Lista as viagens (rotas) planejadas, em andamento e concluídas',
  })
  rotas() {
    return this.viagensService.listarTodos();
  }

  @Get(':pedidoId/status')
  @ApiOperation({
    summary:
      'Feedback ao cliente: quantos km faltam para a entrega do pedido',
  })
  statusEntrega(@Param('pedidoId') pedidoId: string) {
    return this.deliveryTrackingService.estimarDistanciaRestante(pedidoId);
  }

  @Post('processar-fila')
  @ApiOperation({
    summary: 'Força o reprocessamento imediato da fila de pedidos pendentes',
  })
  processarFila() {
    return this.filaProcessamentoService.processarFila();
  }
}
