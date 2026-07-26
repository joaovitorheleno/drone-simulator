import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';

@ApiTags('dashboard')
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get()
  @ApiOperation({
    summary:
      'Relatório consolidado: entregas realizadas, tempo médio, drone mais eficiente e mapa',
  })
  resumo() {
    return this.dashboardService.obterResumo();
  }
}
