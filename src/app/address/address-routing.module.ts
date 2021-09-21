import { LayoutComponent } from '../layout/layout.component';
import { AddressDetailsResolve } from './address-list-details/address-list-details-resolve.service';
import { NgModule }     from '@angular/core';
import { RouterModule } from '@angular/router';


import {AddressFormResolve} from "./address-form/address-form-resolve.service";
import {AddressListComponent} from "./address-list/address-list.component";
import {AddressFormComponent} from "./address-form/address-form.component";
import {AddressDetailsComponent} from "./address-list-details/address-list-details.component";
import { AuthGuard } from '../auth/auth.guard';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'address',
        canActivateChild: [ AuthGuard ],
        component: LayoutComponent,
        children: [
          {
            path: 'new',
            component: AddressFormComponent,
          },
          {
            path: 'edit',
            component: AddressFormComponent,
          },
          {
            path: ':id',
            component: AddressDetailsComponent,
            resolve: {
              address: AddressDetailsResolve
            }
          },
          {
            path: '',
            component: AddressListComponent
          }
        ]
      }
    ])
  ],
  providers: [
    AddressFormResolve,
    AddressDetailsResolve,

  ],
  exports: [
    RouterModule
  ]
})
export  class AddressRoutingModule { }
