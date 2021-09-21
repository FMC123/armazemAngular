import { WarehouseDetailsComponent } from './warehouse-list-details/warehouse-list-details.component';
import { NgModule }     from '@angular/core';
import { RouterModule } from '@angular/router';

import { WarehouseListComponent } from './../warehouse/warehouse-list/warehouse-list.component';
import { WarehouseFormResolve } from './../warehouse/warehouse-form/warehouse-form-resolve.service';
import { WarehouseFormComponent } from './../warehouse/warehouse-form/warehouse-form.component';
import { WarehouseDetailsResolve } from './warehouse-list-details/warehouse-list-details-resolve.service';
import { LayoutComponent } from 'app/layout/layout.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'warehouse',
        component: LayoutComponent,
        children: [
          {
            path: 'new',
            component: WarehouseFormComponent,
            resolve: {
              warehouse: WarehouseFormResolve
            }
          },
          {
            path: 'edit/:id',
            component: WarehouseFormComponent,
            resolve: {
              warehouse: WarehouseFormResolve
            }
          },
          {
            path: ':id',
            component: WarehouseDetailsComponent,
            resolve: {
              warehouse: WarehouseFormResolve
            }
          },
          {
            path: '',
            component: WarehouseListComponent
          }
        ]
      }
    ])
  ],
  providers: [
    WarehouseFormResolve
  ],
  exports: [
    RouterModule
  ]
})
export class WarehouseRoutingModule { }
