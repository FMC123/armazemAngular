import { AuthGuard } from '../auth/auth.guard';
import { NgModule }     from '@angular/core';
import { RouterModule } from '@angular/router';
import {ItemFormResolve} from './item-form/item-form-resolve.service';
import {ItemListComponent} from './item-list/item-list.component';
import {ItemFormComponent} from './item-form/item-form.component';
import {ItemDetailsComponent} from './item-list-details/item-list-details.component';
import { LayoutComponent } from "app/layout/layout.component";


@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'service-item',
        component: LayoutComponent,
        canActivateChild: [ AuthGuard ],
        children: [
          {
            path: 'new',
            component: ItemFormComponent,
            resolve: {
              item: ItemFormResolve
            }
          },
          {
            path: 'edit/:id',
            component: ItemFormComponent,
            resolve: {
              item: ItemFormResolve
            }
          },
          {
            path: ':id',
            component: ItemDetailsComponent,
            resolve: {
              item: ItemFormResolve
            }
          },

          {
            path: '',
            component: ItemListComponent
          }
        ]
      }
    ])
  ],
  providers: [
    ItemFormResolve

  ],
  exports: [
    RouterModule
  ]
})
export  class ServiceItemRoutingModule { }
