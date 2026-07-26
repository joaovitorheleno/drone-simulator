import { Module } from '@nestjs/common';
import { AllocationService } from './allocation.service';
import { ObstaclesService } from './obstacles.service';
import { ObstaclesController } from './obstacles.controller';
import { BatteryService } from './battery.service';
import { DronesModule } from '../drones/drones.module';

@Module({
  imports: [DronesModule],
  controllers: [ObstaclesController],
  providers: [AllocationService, ObstaclesService, BatteryService],
  exports: [AllocationService, ObstaclesService, BatteryService],
})
export class SimulationModule {}
