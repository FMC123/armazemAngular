import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LayoutComponent } from 'app/layout/layout.component';

import { AuthGuard } from '../auth/auth.guard';
import { StorageUnitBatchLogListComponent } from './storage-unit-batch-log-list/storage-unit-batch-log-list.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'storage-unit-batch-log',
        component: LayoutComponent,
        canActivateChild: [ AuthGuard ],
        children: [
          {
            path: '',
            component: StorageUnitBatchLogListComponent
          },
        ]
      }
    ])
  ],
  providers: [
  ],
  exports: [
    RouterModule
  ]
})
export class StorageUnitBatchLogRoutingModule { }
