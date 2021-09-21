import { NgModule } from '@angular/core';

import { BatchOperationRoutingModule } from '../batch-operation/batch-operation-routing.module';
import { BatchSharedModule } from '../batch/batch-shared.module';
import { PackStockModule } from '../pack-stock/pack-stock.module';
import { ServiceChargeSharedModule } from '../service-charge/service-charge-shared.module';
import { SharedModule } from '../shared/shared.module';
import { StorageUnitSharedModule } from '../storage-unit/storage-unit-shared.module';
import { TransportationSharedModule } from '../transportation/transportation-shared.module';
import { AutomationRouteModule } from './../automation-route/automation-route-module';
import { BalanceActionsComponent } from './balance-actions.component';
import { BalanceRoutingModule, routedComponents } from './balance-routing.module';
import { BalanceSharedModule } from './balance-shared.module';
import { BalanceTransportationInComponent } from './balance-transportation/balance-transportation-in.component';
import { BalanceTransportationOutComponent } from './balance-transportation/balance-transportation-out.component';
import {
  BalanceTransportationBatchOperationFormComponent,
} from './balance-transportation/batch-operation-form/balance-transportation-batch-operation-form.component';
import {
  BalanceTransportationInBatchOperationListComponent,
} from './balance-transportation/batch-operation-note-list/balance-transportation-in-batch-operation-list.component';
import {
  BalanceTransportationOutBatchOperationListComponent,
} from './balance-transportation/batch-operation-note-list/balance-transportation-out-batch-operation-list.component';
import {
  BalanceTransportationBatchOperationWeighingAllComponent,
} from './balance-transportation/batch-operation-weighing-all/balance-transportation-batch-operation-weighing-all.component';
import {
  BalanceTransportationBatchWeighingShareComponent,
} from './balance-transportation/batch-weighing-share/balance-transportation-batch-weighing-share.component';
import {
  BalanceTransportationBatchChildWeighingComponent,
} from './balance-transportation/batch-weighing/balance-transportation-batch-child-weighing.component';
import {
  BalanceTransportationFiscalNoteListComponent,
} from './balance-transportation/fiscal-note-list/balance-transportation-fiscal-note-list.component';
import {
  TransportationShippingAuthorizationModalComponent,
} from './balance-transportation/transportation-shipping-authorization-modal/transportation-shipping-authorization-modal.component';
import { BalanceWeightComponent } from './balance-weight.component';
import { BalanceComponent } from './balance.component';
import { BalanceService } from './balance.service';
import { SelectScaleComponent } from './select-scale/select-scale.component';
import { UnifiedActionsComponent } from './unified-actions.component';
import {PackStockMovementListFormComponent} from "./balance-transportation/pack-stock-movement-list-form/pack-stock-movement-list-form.component";
import {BalanceTransportationUnitComponent} from "./balance-transportation/balance-transportation-unit/balance-transportation-unit.component";
import {SelectModule} from "ng2-select";
import {ShippingDataDetailComponent} from "./balance-transportation/shipping-data/shipping-data-detail.component";

@NgModule({
    imports: [
        SharedModule,
        BalanceRoutingModule,
        TransportationSharedModule,
        BatchOperationRoutingModule,
        BatchSharedModule,
        PackStockModule,
        ServiceChargeSharedModule,
        BalanceSharedModule,
        AutomationRouteModule,
        StorageUnitSharedModule,
        SelectModule,
    ],
  exports: [
  ],
  declarations: [
    BalanceComponent,
    ...routedComponents,
    BalanceWeightComponent,
    BalanceActionsComponent,
    BalanceTransportationInComponent,
    BalanceTransportationOutComponent,
    BalanceTransportationFiscalNoteListComponent,
    BalanceTransportationBatchOperationFormComponent,
    BalanceTransportationInBatchOperationListComponent,
    BalanceTransportationOutBatchOperationListComponent,
    BalanceTransportationBatchOperationWeighingAllComponent,
    SelectScaleComponent,
    BalanceTransportationBatchWeighingShareComponent,
    BalanceTransportationBatchChildWeighingComponent,
    TransportationShippingAuthorizationModalComponent,
    UnifiedActionsComponent,
    PackStockMovementListFormComponent,
    BalanceTransportationUnitComponent,
    ShippingDataDetailComponent,
  ],
  providers: [
    BalanceService,
  ]
})
export class BalanceModule { }
