import { NgModule }     from '@angular/core';
import { RouterModule } from '@angular/router';


import {StrainerFormResolve} from "./strainer-form/strainer-form-resolve.service";
import {StrainerListComponent} from "./strainer-list/strainer-list.component";
import {StrainerFormComponent} from "./strainer-form/strainer-form.component";
import {StrainerDetailsComponent} from "./strainer-list-details/strainer-list-details.component";
import { AuthGuard } from '../auth/auth.guard';
import { LayoutComponent } from "app/layout/layout.component";

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'strainer',
        component: LayoutComponent,
        canActivateChild: [ AuthGuard ],
        children: [
          {
            path: 'new',
            component: StrainerFormComponent,
            resolve: {
              strainer: StrainerFormResolve
            }
          },
          {
            path: 'edit/:id',
            component: StrainerFormComponent,
            resolve: {
              strainer: StrainerFormResolve
            }
          },
          {
            path: ':id',
            component: StrainerDetailsComponent,
            resolve: {
              strainer: StrainerFormResolve
            }
          },

          {
            path: '',
            component: StrainerListComponent
          }
        ]
      }
    ])
  ],
  providers: [
    StrainerFormResolve,
    //StrainerDetailsResolve,
  ],
  exports: [
    RouterModule
  ]
})
export  class StrainerRoutingModule { }
