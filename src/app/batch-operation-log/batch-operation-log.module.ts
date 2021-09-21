import { NgModule } from '@angular/core';

import { BatchOperationModule } from '../batch-operation/batch-operation.module';
import { BatchSharedModule } from '../batch/batch-shared.module';
import { PackStockModule } from '../pack-stock/pack-stock.module';
import { ServiceChargeSharedModule } from '../service-charge/service-charge-shared.module';
import { SharedModule } from './../shared/shared.module';
import { BatchOperationLogDetailsComponent } from './batch-operation-log-list-details/batch-operation-log-details.component';
import {
  BatchOperationLogListInfoComponent,
} from './batch-operation-log-list-details/batch-operation-log-list-info.component';
import { BatchOperationFilterLogComponent } from './batch-operation-log-list/batch-operation-log-filter.component';
import { BatchOperationLogListComponent } from './batch-operation-log-list/batch-operation-log-list.component';
import { BatchOperationLogRoutingModule } from './batch-operation-log-routing.module';
import { BatchOperationLogService } from './batch-operation-log.service';


@NgModule({
  imports: [
    SharedModule,
    BatchOperationLogRoutingModule,
    BatchSharedModule,
    PackStockModule,
    ServiceChargeSharedModule,
    BatchOperationModule,
    BatchOperationModule,
  ],
  declarations: [
    BatchOperationFilterLogComponent,
    BatchOperationLogListComponent,
    BatchOperationLogDetailsComponent,
    BatchOperationLogListInfoComponent,
  ],
  providers: [
    BatchOperationLogService,
  ]
})
export class BatchOperationLogModule { }
