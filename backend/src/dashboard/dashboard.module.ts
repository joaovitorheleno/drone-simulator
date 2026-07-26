import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { DronesModule } from '../drones/drones.module';
import { OrdersModule } from '../orders/orders.module';
import { DeliveriesModule } from '../deliveries/deliveries.module';

@Module({
  imports: [DronesModule, OrdersModule, DeliveriesModule],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
