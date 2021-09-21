import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { BatchStorageUnitComponent } from './batch/batch-storage-unit.component';
import { BatchStorageUnitService } from './batch/batch-storage-unit.service';
import { BatchStorageUnitFormComponent } from './batch/storage-unit-form/batch-storage-unit-form.component';
import { BatchStorageUnitListComponent } from './batch/storage-unit-list/batch-storage-unit-list.component';
import { StorageUnitOutService } from './out/storage-unit-out.service';
import { StorageUnitRoutingModule } from './storage-unit-routing.module';
import { StorageUnitService } from './storage-unit.service';
import {BatchStorageUnitHistoryListComponent} from "./batch/storage-unit-history-list/batch-storage-unit-history-list.component";

@NgModule({
  imports: [
    SharedModule,
    StorageUnitRoutingModule
  ],
  exports: [],
  declarations: [
    BatchStorageUnitComponent,
    BatchStorageUnitFormComponent,
    BatchStorageUnitListComponent,
    BatchStorageUnitHistoryListComponent
  ],
  providers: [
    StorageUnitService,
    BatchStorageUnitService,
    StorageUnitOutService,
  ]
})
export class StorageUnitModule { }
