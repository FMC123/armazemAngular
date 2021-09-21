import { BatchLogDetailsResolve } from './batch-log-list-details/batch-log-list-details-resolve.service';
import { BatchLogDetailsComponent } from './batch-log-list-details/batch-log-details.component';
import { NgModule }     from '@angular/core';
import { RouterModule } from '@angular/router';

import { BatchLogListComponent } from './batch-log-list/batch-log-list.component';
import { LayoutComponent } from 'app/layout/layout.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'batch-log',
        component: LayoutComponent,
        children: [
          {
            path: '',
            component: BatchLogListComponent
          },
          {
            path: ':id',
            component: BatchLogDetailsComponent,
            resolve: {
              batchLog: BatchLogDetailsResolve,
            }

          }
        ]
      }
    ])
  ],
  providers: [
    BatchLogDetailsResolve,
  ],
  exports: [
    RouterModule
  ]
})
export class BatchLogRoutingModule { }
