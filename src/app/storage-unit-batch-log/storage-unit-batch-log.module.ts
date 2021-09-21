import { NgModule } from '@angular/core';
import {
  StorageUnitBatchLogFilterComponent,
} from 'app/storage-unit-batch-log/storage-unit-batch-log-list/storage-unit-batch-log-filter.component';

import { SharedModule } from '../shared/shared.module';
import { StorageUnitBatchLogListComponent } from './storage-unit-batch-log-list/storage-unit-batch-log-list.component';
import { StorageUnitBatchLogRoutingModule } from './storage-unit-batch-log-routing.module';
import { StorageUnitBatchLogService } from './storage-unit-batch-log.service';

@NgModule({
  imports: [
    SharedModule,
    StorageUnitBatchLogRoutingModule
  ],
  declarations: [
    StorageUnitBatchLogListComponent,
    StorageUnitBatchLogFilterComponent,
  ],
  providers: [
    StorageUnitBatchLogService,
  ]
 })
export class StorageUnitBatchLogModule { }
