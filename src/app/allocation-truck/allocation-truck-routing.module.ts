import { AllocationTruckListComponent } from './allocation-truck-list/allocation-truck-list.component';
import { AllocationTruckListResolve } from './allocation-truck-list/allocation-truck-list-resolve';
import { LayoutComponent } from '../layout/layout.component';
import { AuthGuard } from '../auth/auth.guard';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';




@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'allocation-truck',
        component: LayoutComponent,
        children: [
          {
            path: '',
            component: AllocationTruckListComponent
          },
          {
            path: 'edit/:id',
            component: AllocationTruckListComponent,
            resolve: {
              batchLog: AllocationTruckListResolve,
            }

          }
        ]
      }
    ])
  ],
  providers: [
    AllocationTruckListResolve,
  ],
  exports: [
    RouterModule
  ]
})
export class AllocationTruckRoutingModule { }

