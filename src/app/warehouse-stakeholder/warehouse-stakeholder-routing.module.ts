import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AuthGuard } from '../auth/auth.guard';
import { WarehouseStakeholderFormResolve } from './warehouse-stakeholder-form/warehouse-stakeholder-form-resolve.service';
import { WarehouseStakeholderFormComponent } from './warehouse-stakeholder-form/warehouse-stakeholder-form.component';
import {
    WarehouseStakeholderDetailsResolve,
} from './warehouse-stakeholder-list-details/warehouse-stakeholder-list-details-resolve.service';
import {
    WarehouseStakeholderDetailsComponent,
} from './warehouse-stakeholder-list-details/warehouse-stakeholder-list-details.component';
import {WarehouseStakeholderListComponent} from './warehouse-stakeholder-list/warehouse-stakeholder-list.component';
import { LayoutComponent } from "app/layout/layout.component";

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'warehouse-stakeholder',
        component: LayoutComponent,
         canActivateChild: [ AuthGuard ],
        children: [
          {
            path: 'new',
            component: WarehouseStakeholderFormComponent,
            resolve: {
              warehouseStakeholder: WarehouseStakeholderFormResolve
            }
          },
          {
            path: 'edit/:id',
            component: WarehouseStakeholderFormComponent,
            resolve: {
              warehouseStakeholder: WarehouseStakeholderFormResolve
            }
          },
           {
            path: ':id',
            component: WarehouseStakeholderDetailsComponent,
            resolve: {
              warehouseStakeholder: WarehouseStakeholderFormResolve
            }
          },
          {
            path: '',
            component: WarehouseStakeholderListComponent
          }
        ]
      }
    ])
  ],
  providers: [
    WarehouseStakeholderFormResolve
  ],
  exports: [
    RouterModule
  ]
})
export class WarehouseStakeholderRoutingModule { }
