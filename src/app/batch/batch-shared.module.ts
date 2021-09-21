import { NgModule } from '@angular/core';
import { BalanceSharedModule } from 'app/balance/balance-shared.module';

import { AutomationRouteModule } from '../automation-route/automation-route-module';
import { SharedModule } from '../shared/shared.module';
import { BatchCreationComponent } from './batch-creation/batch-creation.component';
import { BatchDetailSimpleComponent } from './batch-detail-simple/batch-detail-simple.component';
import { StorageUnitSharedModule } from '../storage-unit/storage-unit-shared.module';
import {SelectModule} from "ng2-select";

@NgModule({
  imports: [
    SharedModule,
    BalanceSharedModule,
    AutomationRouteModule,
    StorageUnitSharedModule,
    SelectModule,
  ],
  exports: [
    BatchCreationComponent,
    BatchDetailSimpleComponent,
  ],
  declarations: [
    BatchCreationComponent,
    BatchDetailSimpleComponent,
  ],
  providers: [],
})
export class BatchSharedModule { }
