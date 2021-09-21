import { AllocationTruckService } from './allocation-truck.service';
import { AllocationTruckRoutingModule } from './allocation-truck-routing.module';
import { SharedModule } from '../shared/shared.module';
import { AllocationTruckListComponent } from './allocation-truck-list/allocation-truck-list.component';
import { NgModule } from '@angular/core';

@NgModule({
  imports: [
    SharedModule,
    AllocationTruckRoutingModule,
  ],
  exports: [],
  declarations: [
    AllocationTruckListComponent,
  ],
  providers: [
    AllocationTruckService,
  ],
})
export class AllocationTruckModule { }
