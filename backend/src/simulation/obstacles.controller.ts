import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ObstaclesService } from './obstacles.service';
import { CreateObstaculoDto } from './dto/create-obstaculo.dto';

@ApiTags('obstaculos')
@Controller('obstaculos')
export class ObstaclesController {
  constructor(private readonly obstaclesService: ObstaclesService) {}

  @Get()
  @ApiOperation({ summary: 'Lista as zonas de exclusão aérea cadastradas' })
  listar() {
    return this.obstaclesService.listarTodos();
  }

  @Post()
  @ApiOperation({ summary: 'Cadastra uma nova zona de exclusão aérea' })
  criar(@Body() dto: CreateObstaculoDto) {
    return this.obstaclesService.criar(dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove uma zona de exclusão aérea' })
  remover(@Param('id') id: string) {
    this.obstaclesService.remover(id);
    return { removido: true };
  }
}
