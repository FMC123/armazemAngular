import { DrinkDetailsResolve } from './drink-list-details/drink-list-details-resolve.service';
import { NgModule }     from '@angular/core';
import { RouterModule } from '@angular/router';


import {DrinkFormResolve} from "./drink-form/drink-form-resolve.service";
import {DrinkListComponent} from "./drink-list/drink-list.component";
import {DrinkFormComponent} from "./drink-form/drink-form.component";
import {DrinkDetailsComponent} from "./drink-list-details/drink-list-details.component";
import { AuthGuard } from '../auth/auth.guard';
import { LayoutComponent } from "app/layout/layout.component";

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'drink',
        component: LayoutComponent,
        canActivateChild: [ AuthGuard ],
        children: [
          {
            path: 'new',
            component: DrinkFormComponent,
            resolve: {
              drink: DrinkFormResolve
            }
          },
          {
            path: 'edit/:id',
            component: DrinkFormComponent,
            resolve: {
              drink: DrinkFormResolve
            }
          },
          {
            path: ':id',
            component: DrinkDetailsComponent,
            resolve: {
              drink: DrinkDetailsResolve,
            }
          },

          {
            path: '',
            component: DrinkListComponent
          }
        ]
      }
    ])
  ],
  providers: [
    DrinkFormResolve,
    DrinkDetailsResolve,
  ],
  exports: [
    RouterModule
  ]
})
export  class DrinkRoutingModule { }
