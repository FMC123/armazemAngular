import { ServiceRequestDetailsResolve } from './service-request-details/service-request-details-resolve.service';
import { ServiceRequestDetailsComponent } from './service-request-details/service-request-details.component';
import { AuthGuard } from '../auth/auth.guard';
import { ServiceRequestListComponent } from './service-request-list/service-request-list.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from '../layout/layout.component';

const routes: Routes = [
  {
    path: 'service-request',
    component: LayoutComponent,
    canActivateChild: [AuthGuard],
    children: [
      {
        path: ':id',
        component: ServiceRequestDetailsComponent,
        resolve: {
          serviceRequest: ServiceRequestDetailsResolve
        }
      },
      {
        path: '',
        component: ServiceRequestListComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  providers: [ServiceRequestDetailsResolve],
  exports: [RouterModule]
})

export class ServiceRequestRoutingModule { }

export const routedComponents = [
  ServiceRequestListComponent,
  ServiceRequestDetailsComponent
];
