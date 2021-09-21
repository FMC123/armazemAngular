import { LayoutComponent } from '../layout/layout.component';
import { NgModule }     from '@angular/core';
import { RouterModule } from '@angular/router';


import {FarmFormResolve} from "./farm-form/farm-form-resolve.service";
import {FarmListComponent} from "./farm-list/farm-list.component";
import {FarmFormComponent} from "./farm-form/farm-form.component";
import {FarmDetailsComponent} from "./farm-list-details/farm-list-details.component";
import { AuthGuard } from '../auth/auth.guard';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'farm',
        component: LayoutComponent,
        canActivateChild: [ AuthGuard ],
        children: [
          {
            path: 'new',
            component: FarmFormComponent,
            resolve: {
              farm: FarmFormResolve
            }
          },
          {
            path: 'edit/:id',
            component: FarmFormComponent,
            resolve: {
              farm: FarmFormResolve
            }
          },
          {
            path: ':id',
            component: FarmDetailsComponent,
            resolve: {
              farm: FarmFormResolve
            }
          },

          {
            path: '',
            component: FarmListComponent
          }
        ]
      }
    ])
  ],
  providers: [
    FarmFormResolve

  ],
  exports: [
    RouterModule
  ]
})
export  class FarmRoutingModule { }
