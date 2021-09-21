import { ServiceGroupItemDetailsComponent } from './service-group-item-details/service-group-item-details.component';
import { ServiceGroupItemFormResolve } from './service-group-item-form/service-group-item-form-resolve.service';
import { ServiceGroupItemFormComponent } from './service-group-item-form/service-group-item-form.component';
import { ServiceGroupItemListComponent } from './service-group-item-list/service-group-item-list.component';
import { AuthGuard } from '../auth/auth.guard';
import { NgModule }     from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'service-group-item',
        canActivateChild: [ AuthGuard ],
        children: [
          {
            path: 'new',
            component: ServiceGroupItemFormComponent,
            resolve: {
              serviceGroupItem: ServiceGroupItemFormResolve
            }
          },
          {
            path: 'edit/:id',
            component: ServiceGroupItemFormComponent,
            resolve: {
              serviceGroupItem: ServiceGroupItemFormResolve
            }
          },
          {
            path: ':id',
            component: ServiceGroupItemDetailsComponent,
            resolve: {
              serviceGroupItem: ServiceGroupItemFormResolve
            }
          },
          {
            path: '',
            component: ServiceGroupItemListComponent
          }
        ]
      }
    ])
  ],
  providers: [
    ServiceGroupItemFormResolve
  ],
  exports: [
    RouterModule
  ]
})
export class ServiceGroupItemRoutingModule { }
