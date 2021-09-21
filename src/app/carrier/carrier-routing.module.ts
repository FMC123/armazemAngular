import { NgModule }     from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard } from '../auth/auth.guard';

import {CarrierFormResolve} from "./carrier-form/carrier-form-resolve.service";
import {CarrierListComponent} from "./carrier-list/carrier-list.component";
import {CarrierFormComponent} from "./carrier-form/carrier-form.component";
import {CarrierDetailsComponent} from "./carrier-list-details/carrier-list-details.component";
import { LayoutComponent } from "app/layout/layout.component";


@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'carrier',
        component: LayoutComponent,
        canActivateChild: [ AuthGuard ],
        children: [
          {
            path: 'new',
            component: CarrierFormComponent,
            resolve: {
              carrier: CarrierFormResolve
            }
          },
          {
            path: 'edit/:id',
            component: CarrierFormComponent,
            resolve: {
              carrier: CarrierFormResolve
            }
          },
          {
            path: ':id',
            component: CarrierDetailsComponent,
            resolve: {
              carrier: CarrierFormResolve
            }
          },
          {
            path: '',
            component: CarrierListComponent
          }
        ]
      }
    ])
  ],
  providers: [
    CarrierFormResolve

  ],
  exports: [
    RouterModule
  ]
})
export  class CarrierRoutingModule { }
