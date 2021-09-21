import { NgModule }     from '@angular/core';
import { RouterModule } from '@angular/router';

import { AuthGuard } from '../auth/auth.guard';
import { LayoutComponent } from '../layout/layout.component';
import { ParameterFormResolve } from './parameter-form/parameter-form-resolve.service';
import { ParameterListComponent } from './parameter-list/parameter-list.component';
import {ParameterFormComponent} from './parameter-form/parameter-form.component';


@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'parameter',
        component: LayoutComponent,
        canActivateChild: [ AuthGuard ],
        children: [
          {
            path: 'new',
            component: ParameterFormComponent,
            resolve: {
              parameter: ParameterFormResolve
            }
          },
          {
            path: 'edit/:id',
            component: ParameterFormComponent,
            resolve: {
              parameter: ParameterFormResolve
            }
          },
           {
            path: '',
            component: ParameterListComponent
          }
        ]
      }
    ])
  ],
  providers: [
    ParameterFormResolve

  ],
  exports: [
    RouterModule
  ]
})
export  class ParameterRoutingModule { }
