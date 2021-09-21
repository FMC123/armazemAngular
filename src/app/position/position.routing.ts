import { AuthGuard } from '../auth/auth.guard';
import { LayoutComponent } from '../layout/layout.component';
import { PositionFormResolve } from '../position/position-form/position-form-resolve.service';
import { PositionFormComponent } from '../position/position-form/position-form.component';
import { PositionDetailsResolve } from './position-list-details/position-list-details-resolve.service';
import { PositionDetailsComponent } from './position-list-details/position-list-details.component';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'position',
        component: LayoutComponent,
        canActivateChild: [ AuthGuard ],
        children: [
          {

            path: 'new',
            component: PositionFormComponent,
            resolve: {
              position: PositionFormResolve
            }
          },
          {
            path: 'edit/:id',
            component: PositionFormComponent,
            resolve: {
              position: PositionFormResolve
            }
          },
          {
            path: ':id',
            component: PositionDetailsComponent,
            resolve: {
              position: PositionDetailsResolve
            }
          }
        ]
      }
    ])
  ],
  providers: [
    PositionFormResolve,
    PositionDetailsResolve
  ],
  exports: [
    RouterModule
  ]
})
export  class PositionRoutingModule { }
