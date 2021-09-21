import { NgModule }     from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard } from '../auth/auth.guard';

import {DriverFormResolve} from "./driver-form/driver-form-resolve.service";
import {DriverListComponent} from "./driver-list/driver-list.component";
import {DriverFormComponent} from "./driver-form/driver-form.component";
import {DriverDetailsComponent} from "./driver-list-details/driver-list-details.component";
import { LayoutComponent } from "app/layout/layout.component";
import {DriverService} from "./driver.service";


@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'driver',
        component: LayoutComponent,
        canActivateChild: [ AuthGuard ],
        children: [
          {
            path: 'new',
            component: DriverFormComponent,
            resolve: {
              driver: DriverFormResolve
            }
          },
          {
            path: 'edit/:id',
            component: DriverFormComponent,
            resolve: {
              driver: DriverFormResolve
            }
          },
          {
            path: ':id',
            component: DriverDetailsComponent,
            resolve: {
              driver: DriverFormResolve
            }
          },
          {
            path: '',
            component: DriverListComponent
          }
        ]
      }
    ])
  ],
  providers: [
    DriverFormResolve
  ],
  exports: [
    RouterModule
  ]
})
export  class DriverRoutingModule { }
