import { NgModule } from '@angular/core';
import { SharedModule } from './../shared/shared.module';
import {
  ServiceInstructionRoutingModule,
  routedComponents
} from './service-instruction-routing.module';
import { ServiceInstructionService } from './service-instruction.service';
import { ServiceInstructionListFilterComponent } from './service-instruction-list/service-instruction-list-filter.component';
import { ServiceInstructionSampleTrackingComponent } from './service-instruction-sample-tracking/service-instruction-sample-tracking.component';
import { ServiceInstructionServicesComponent } from './service-instruction-services/service-instruction-services.component';
import { ServiceInstructionExpectedResultComponent } from './service-instruction-expected-result/service-instruction-expected-result.component';
import { ServiceInstructionBatchSelectionComponent } from './service-instruction-batch-selection/service-instruction-batch-selection.component';
import { ServiceInstructionExecutedResultComponent} from "./service-instruction-executed-result/service-instruction-executed-result.component";
import { ServiceInstructionBatchOperationComponent } from './service-instruction-batch-operation/service-instruction-batch-operation.component';
import {ServiceInstructionOrderComponent} from "./service-instruction-order/service-instruction-order.component";
import {ServiceOrderModule} from "../service-order/service-order.module";
import { ServiceInstructionSelectBatchComponent } from './service-instruction-select-batch/service-instruction-select-batch.component';

@NgModule({
  imports: [SharedModule, ServiceInstructionRoutingModule, ServiceOrderModule],
  declarations: [
    ...routedComponents,
    ServiceInstructionListFilterComponent,
    ServiceInstructionSampleTrackingComponent,
    ServiceInstructionServicesComponent,
    ServiceInstructionExpectedResultComponent,
    ServiceInstructionBatchSelectionComponent,
    ServiceInstructionExecutedResultComponent,
    ServiceInstructionOrderComponent,
    ServiceInstructionBatchOperationComponent,
    ServiceInstructionSelectBatchComponent,
  ],
  providers: [ServiceInstructionService]
})
export class ServiceInstructionModule { }
