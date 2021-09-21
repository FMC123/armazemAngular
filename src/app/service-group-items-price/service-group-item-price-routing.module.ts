import {
    ServiceGroupItemPriceFormComponent
} from './service-group-item-price-form/service-group-item-price-form.component';
import {
    ServiceGroupItemPriceListComponent
} from './service-group-item-price-list/service-group-item-price-list.component';
import {
    ServiceGroupItemPriceFormResolve
} from './service-group-item-price-form/service-group-item-price-form-resolve.service';
import { AuthGuard } from '../auth/auth.guard';
import { NgModule }     from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'service-group-item-price',
        canActivateChild: [ AuthGuard ],
        children: [
          {
            path: 'new',
            component: ServiceGroupItemPriceFormComponent,
            resolve: {
              serviceGroupItemPrice: ServiceGroupItemPriceFormResolve
            }
          },
          {
            path: 'edit/:id',
            component: ServiceGroupItemPriceFormComponent,
            resolve: {
              serviceGroupItemPrice: ServiceGroupItemPriceFormResolve
            }
          },
          {
            path: '',
            component: ServiceGroupItemPriceListComponent
          }
        ]
      }
    ])
  ],
  providers: [
    ServiceGroupItemPriceFormResolve
  ],
  exports: [
    RouterModule
  ]
})
export class ServiceGroupItemPriceRoutingModule { }
