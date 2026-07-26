import { Module, forwardRef } from '@nestjs/common';
import { DeliveriesController } from './deliveries.controller';
import { ViagensService } from './viagens.service';
import { DroneFlightService } from './drone-flight.service';
import { FilaProcessamentoService } from './fila-processamento.service';
import { DeliveryTrackingService } from './delivery-tracking.service';
import { DronesModule } from '../drones/drones.module';
import { OrdersModule } from '../orders/orders.module';
import { SimulationModule } from '../simulation/simulation.module';

@Module({
  imports: [DronesModule, forwardRef(() => OrdersModule), SimulationModule],
  controllers: [DeliveriesController],
  providers: [
    ViagensService,
    DroneFlightService,
    FilaProcessamentoService,
    DeliveryTrackingService,
  ],
  exports: [ViagensService, FilaProcessamentoService, DeliveryTrackingService],
})
export class DeliveriesModule {}
