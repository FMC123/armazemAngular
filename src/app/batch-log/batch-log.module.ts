import { NgModule } from '@angular/core';

import { SharedModule } from './../shared/shared.module';
import { BatchLogDetailsComponent } from './batch-log-list-details/batch-log-details.component';
import { BatchLogListInfoComponent } from './batch-log-list-details/batch-log-list-info.component';
import { BatchLogFilterComponent } from './batch-log-list/batch-log-filter.component';
import { BatchLogListComponent } from './batch-log-list/batch-log-list.component';
import { BatchLogRoutingModule } from './batch-log-routing.module';
import { BatchLogService } from './batch-log.service';

@NgModule({
  imports: [
    SharedModule,
    BatchLogRoutingModule
  ],
  declarations: [
    BatchLogFilterComponent,
    BatchLogListComponent,
    BatchLogDetailsComponent,
    BatchLogListInfoComponent,
  ],
  providers: [
    BatchLogService,
  ]
})
export class BatchLogModule { }
