import { NgModule }     from '@angular/core';
import { RouterModule } from '@angular/router';

import { AuthGuard } from '../auth/auth.guard';
import { LayoutComponent } from '../layout/layout.component';
import { ScaleFormResolve } from './scale-form/scale-form-resolve.service';
import { ScaleListComponent } from './scale-list/scale-list.component';
import { ScaleFormComponent } from './scale-form/scale-form.component';
import { ScaleDetailsResolve } from './scale-list-details/scale-list-details-resolve.service';
import { ScaleDetailsComponent } from './scale-list-details/scale-list-details.component';


@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'scale',
        component: LayoutComponent,
        canActivateChild: [ AuthGuard ],
        children: [
          {
            path: 'new',
            component: ScaleFormComponent,
            resolve: {
              scale: ScaleFormResolve
            }
          },
          {
            path: 'edit/:id',
            component: ScaleFormComponent,
            resolve: {
              scale: ScaleFormResolve
            }
          },
          {
            path: ':id',
            component: ScaleDetailsComponent,
            resolve: {
              scale: ScaleDetailsResolve,
            }
          },
           {
            path: '',
            component: ScaleListComponent
          }
        ]
      }
    ])
  ],
  providers: [
    ScaleFormResolve,
    ScaleDetailsResolve,
  ],
  exports: [
    RouterModule
  ]
})
export  class ScaleRoutingModule { }
