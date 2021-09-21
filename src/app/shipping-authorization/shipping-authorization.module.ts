import { NgModule } from '@angular/core';

import { TransportationSharedModule } from '../transportation/transportation-shared.module';
import {ErrorHandler, SharedModule} from './../shared/shared.module';
import {
  ShippingAuthorizationBatchOperationBatchFormComponent,
} from './shipping-authorization-batch-operation-form/shipping-authorization-batch-operation-batch-form.component';
import {
  ShippingAuthorizationBatchOperationFormComponent,
} from './shipping-authorization-batch-operation-form/shipping-authorization-batch-operation-form.component';
import {
  ShippingAuthorizationBatchOperationModalComponent,
} from './shipping-authorization-batch-operation-modal/shipping-authorization-batch-operation-modal.component';
import {
  ShippingAuthorizationDetailsComponent,
} from './shipping-authorization-details/shipping-authorization-details.component';
import { ShippingAuthorizationInfoComponent } from './shipping-authorization-details/shipping-authorization-info.component';
import {
  ShippingAuthorizationBatchFormComponent,
} from './shipping-authorization-form/shipping-authorization-batch-form.component';
import { ShippingAuthorizationFormComponent } from './shipping-authorization-form/shipping-authorization-form.component';
import { ShippingAuthorizationListComponent } from './shipping-authorization-list/shipping-authorization-list.component';
import { ShippingAuthorizationRoutingModule } from './shipping-authorization-routing.module';
import { ShippingAuthorizationService } from './shipping-authorization.service';
import {ShippingAuthorizationBatchSelectionComponent} from "./shipping-authorization-batch-selection/shipping-authorization-batch-selection.component";
import {ParameterService} from "../parameter/parameter.service";
import {ShippingAuthorizationBatchOperationPacktypeFormComponent} from "./shipping-authorization-batch-operation-form/shipping-authorization-batch-operation-packtype-form.component";

@NgModule({
  imports: [
    SharedModule,
    ShippingAuthorizationRoutingModule,
    TransportationSharedModule
  ],
  declarations: [
    ShippingAuthorizationFormComponent,
    ShippingAuthorizationListComponent,
    ShippingAuthorizationDetailsComponent,
    ShippingAuthorizationInfoComponent,
    ShippingAuthorizationBatchFormComponent,
    ShippingAuthorizationBatchOperationFormComponent,
    ShippingAuthorizationBatchOperationModalComponent,
    ShippingAuthorizationBatchOperationBatchFormComponent,
    ShippingAuthorizationBatchSelectionComponent,
    ShippingAuthorizationBatchOperationPacktypeFormComponent,
  ],
  providers: [
    ShippingAuthorizationService,
    ParameterService
  ]
})
export class ShippingAuthorizationModule { }
