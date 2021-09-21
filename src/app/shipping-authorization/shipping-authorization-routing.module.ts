import {
    ShippingAuthorizationBatchOperationFormResolve,
} from './shipping-authorization-batch-operation-form/shipping-authorization-batch-operation-form-resolve.service';
import {
    ShippingAuthorizationBatchOperationFormComponent,
} from './shipping-authorization-batch-operation-form/shipping-authorization-batch-operation-form.component';
import { ShippingAuthorizationDetailsResolve } from './shipping-authorization-details/shipping-authorization-details-resolve.service';
import { ShippingAuthorizationDetailsComponent } from './shipping-authorization-details/shipping-authorization-details.component';
import { AuthGuard } from '../auth/auth.guard';
import { ShippingAuthorizationFormResolve } from './shipping-authorization-form/shipping-authorization-form-resolve.service';
import { ShippingAuthorizationFormComponent } from './shipping-authorization-form/shipping-authorization-form.component';
import { ShippingAuthorizationListComponent } from './shipping-authorization-list/shipping-authorization-list.component';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LayoutComponent } from 'app/layout/layout.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'shipping-authorization',
        component: LayoutComponent,
        canActivateChild: [ AuthGuard ],
        children: [
          {
            path: 'new',
            component: ShippingAuthorizationFormComponent,
            resolve: {
              shippingAuthorization: ShippingAuthorizationFormResolve
            }
          },
          {
            path: 'edit/:id',
            component: ShippingAuthorizationFormComponent,
            resolve: {
              shippingAuthorization: ShippingAuthorizationFormResolve
            }
          },
          {
            path: ':id',
            component: ShippingAuthorizationDetailsComponent,
            resolve: {
              shippingAuthorization: ShippingAuthorizationDetailsResolve,
            }
          },
          {
            path: ':id/transportation/:transportationId',
            component: ShippingAuthorizationBatchOperationFormComponent,
            resolve: {
              transportation: ShippingAuthorizationBatchOperationFormResolve,
            }
          },
          {
            path: '',
            component: ShippingAuthorizationListComponent
          }
        ]
      }
    ])
  ],
  providers: [
    ShippingAuthorizationFormResolve,
    ShippingAuthorizationDetailsResolve,
    ShippingAuthorizationBatchOperationFormResolve
  ],
  exports: [
    RouterModule
  ]
})
export class ShippingAuthorizationRoutingModule { }
