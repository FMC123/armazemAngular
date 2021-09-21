import { LayoutComponent } from '../layout/layout.component';
import {
    CustomerContactListDetailsResolve,
} from './customer-contact-list-details/customer-contact-list-details-resolve.service';
import { CustomerContactDetailsComponent } from './customer-contact-list-details/customer-contact-list-details.component';
import { AuthGuard } from '../auth/auth.guard';
import { CustomerContactFormComponent } from './customer-contact-form/customer-contact-form.component';
import { CustomerContactResolve } from './customer-contact-form/customer-contact-resolve.service';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { CustomerContactListComponent } from './customer-contact-list/customer-contact-list.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'customer-contact',
        canActivateChild: [ AuthGuard ],
        component: LayoutComponent,
        children: [
          {
            path: 'new',
            component: CustomerContactFormComponent,
          },
          {
            path: 'edit',
            component: CustomerContactFormComponent,
          },
           {
            path: ':id',
            component: CustomerContactDetailsComponent,
            resolve: {
              customerContact : CustomerContactListDetailsResolve
            }
          },
          {
            path: '',
            component: CustomerContactListComponent
          }
        ]
      }
    ])
  ],
  providers: [
    CustomerContactResolve,
    CustomerContactListDetailsResolve,
  ],
  exports: [
    RouterModule
  ]
})

export class CustomerContactRoutingModule { }
