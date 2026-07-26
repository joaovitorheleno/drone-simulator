import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DronesModule } from './drones/drones.module';
import { OrdersModule } from './orders/orders.module';
import { DeliveriesModule } from './deliveries/deliveries.module';
import { SimulationModule } from './simulation/simulation.module';
import { DashboardModule } from './dashboard/dashboard.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DronesModule,
    OrdersModule,
    DeliveriesModule,
    SimulationModule,
    DashboardModule,
  ],
})
export class AppModule {}
