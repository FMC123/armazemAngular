import { LayoutComponent } from '../layout/layout.component';
import { BatchStorageUnitService } from './batch/batch-storage-unit.service';
import { BatchStorageUnitResolve } from './batch/batch-storage-unit-resolve.service';
import { BatchStorageUnitComponent } from './batch/batch-storage-unit.component';
import { NgModule }     from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard } from './../auth/auth.guard';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'batch-operation/:batchOperationId/batch/:batchId/storage-unit',
        component: LayoutComponent,
        canActivateChild: [ AuthGuard ],
        children: [
          {
            path: '',
            component: BatchStorageUnitComponent,
            resolve: {
              batch: BatchStorageUnitResolve,
            }
          }
        ]
      }
    ])
  ],
  providers: [
    BatchStorageUnitResolve,
  ],
  exports: [
    RouterModule
  ]
})
export class StorageUnitRoutingModule { }
