import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { ServiceChargeService } from 'app/service-charge/service-charge.service';
import { ChargingGenerationRoutingModule } from './charging-generation-routing.module';
import { ChargingGenerationComponent } from './charging-generation.component';
import { ChargingGenerationFilterComponent } from './charging-generation-filter.component';
import { ChargingGenerationAddModalComponent } from './charging-generation-add-modal/charging-generation-add-modal.component';

@NgModule({
  imports: [
    SharedModule,
    ChargingGenerationRoutingModule
  ],
  declarations: [
    ChargingGenerationComponent,
    ChargingGenerationFilterComponent,
    ChargingGenerationAddModalComponent
  ],
  providers: [
    ServiceChargeService,
  ]
})
export class ChargingGenerationModule { }