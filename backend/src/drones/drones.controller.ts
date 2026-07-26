import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { DronesService } from './drones.service';
import { CreateDroneDto } from './dto/create-drone.dto';

@ApiTags('drones')
@Controller('drones')
export class DronesController {
  constructor(private readonly dronesService: DronesService) {}

  @Get('status')
  @ApiOperation({
    summary: 'Retorna o status atual de todos os drones da frota',
  })
  status() {
    return this.dronesService.listarTodos();
  }

  @Get()
  @ApiOperation({ summary: 'Lista todos os drones cadastrados' })
  listar() {
    return this.dronesService.listarTodos();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Busca um drone pelo id' })
  buscarPorId(@Param('id') id: string) {
    return this.dronesService.buscarPorId(id);
  }

  @Post()
  @ApiOperation({ summary: 'Cadastra um novo drone na frota' })
  criar(@Body() dto: CreateDroneDto) {
    return this.dronesService.criar(dto);
  }
}
