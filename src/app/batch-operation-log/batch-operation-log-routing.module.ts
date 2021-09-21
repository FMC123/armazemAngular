import { BatchOperationLogDetailsResolve } from './batch-operation-log-list-details/batch-operation-log-list-details-resolve.service';
import { BatchOperationLogDetailsComponent } from './batch-operation-log-list-details/batch-operation-log-details.component';
import { NgModule }     from '@angular/core';
import { RouterModule } from '@angular/router';

import { BatchOperationLogListComponent } from './batch-operation-log-list/batch-operation-log-list.component';
import { LayoutComponent } from 'app/layout/layout.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'batch-operation-log',
        component: LayoutComponent,
        children: [
          {
            path: '',
            component: BatchOperationLogListComponent
          },
          {
            path: ':id',
            component: BatchOperationLogDetailsComponent,
            resolve: {
              batchOperationLog: BatchOperationLogDetailsResolve,
            }

          }
        ]
      }
    ])
  ],
  providers: [
    BatchOperationLogDetailsResolve,
  ],
  exports: [
    RouterModule
  ]
})
export class BatchOperationLogRoutingModule { }
