import { ServiceGroupDetailsResolve } from './service-group-list-detail/service-group-list-details-resolve.service';

import { ServiceGroupDetailsComponent } from './service-group-list-detail/service-group-list-details.component';
import { ServiceGroupFormResolve } from './service-group-form/service-group-form-resolve.service';
import { ServiceGroupFormComponent } from './service-group-form/service-group-form.component';
import { ServiceGroupListComponent } from './service-group-list/service-group-list.component';
import { AuthGuard } from '../auth/auth.guard';
import { NgModule }     from '@angular/core';
import { RouterModule } from '@angular/router';
import { LayoutComponent } from "app/layout/layout.component";

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'service-group',
        component: LayoutComponent,
        canActivateChild: [ AuthGuard ],
        children: [
          {
            path: 'new',
            component: ServiceGroupFormComponent,
            resolve: {
              serviceGroup: ServiceGroupFormResolve
            }
          },
          {
            path: 'edit/:id',
            component: ServiceGroupFormComponent,
            resolve: {
              serviceGroup: ServiceGroupFormResolve
            }
          },
          {
            path: ':id',
            component: ServiceGroupDetailsComponent,
            resolve: {
              serviceGroup: ServiceGroupFormResolve
            }
          },
          {
            path: '',
            component: ServiceGroupListComponent
          }
        ]
      }
    ])
  ],
  providers: [
    ServiceGroupFormResolve
  ],
  exports: [
    RouterModule
  ]
})
export class ServiceGroupRoutingModule { }
