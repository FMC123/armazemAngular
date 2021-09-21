import { NgModule }     from '@angular/core';
import { RouterModule } from '@angular/router';

import { AuthGuard } from '../auth/auth.guard';
import { LayoutComponent } from '../layout/layout.component';
import { PositionLayerFormResolve } from './position-layer-form/position-layer-form-resolve.service';
import { PositionLayerListComponent } from './position-layer-list/position-layer-list.component';
import {PositionLayerFormComponent} from './position-layer-form/position-layer-form.component';
import {PositionLayerDetailsComponent} from './position-layer-list-details/position-layer-list-details.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'position-layer',
        component: LayoutComponent,
        canActivateChild: [ AuthGuard ],
        children: [
          {
            path: 'new',
            component: PositionLayerFormComponent,
            resolve: {
              positionLayer: PositionLayerFormResolve
            }
          },
          {
            path: 'edit/:id',
            component: PositionLayerFormComponent,
            resolve: {
              positionLayer: PositionLayerFormResolve
            }
          },
          {
            path: ':id',
            component: PositionLayerDetailsComponent,
            resolve: {
              positionLayer: PositionLayerFormResolve
            }
          },

          {
            path: '',
            component: PositionLayerListComponent
          }
        ]
      }
    ])
  ],
  providers: [
    PositionLayerFormResolve

  ],
  exports: [
    RouterModule
  ]
})
export  class PositionLayerRoutingModule { }
