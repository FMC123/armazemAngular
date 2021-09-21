import { NgModule }     from '@angular/core';
import { RouterModule } from '@angular/router';

import { LayoutComponent } from '../layout/layout.component';
import { StackFormResolve } from './stack-form/stack-form-resolve.service';
import { StackFormComponent } from './stack-form/stack-form.component';
import { StackDetailsComponent } from './stack-list-details/stack-list-details.component';
import {StackDetailsResolve} from "./stack-list-details/stack-list-details-resolve.service";

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'stack',
        component: LayoutComponent,
        children: [
          {

            path: 'new',
            component: StackFormComponent,
            resolve: {
              stack: StackFormResolve
            }
          },
          {
            path: 'edit/:id',
            component: StackFormComponent,
            resolve: {
              stack: StackFormResolve
            }
          },
          {
            path: ':id',
            component: StackDetailsComponent,
            resolve: {
              stack: StackDetailsResolve
            }
          }
        ]
      }
    ])
  ],
  providers: [
    StackFormResolve,
    StackDetailsResolve

  ],
  exports: [
    RouterModule
  ]
})
export  class StackRoutingModule { }
