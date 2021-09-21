import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';

import {SkuListComponent} from './sku-list/sku-list.component';
import {LayoutComponent} from "app/layout/layout.component";
import {SkuDetailsComponent} from "./sku-list-details/sku-list-details.component";
import {SkuResolve} from "./sku-resolve.service";
import {SkuEditComponent} from "./sku-edit/sku-edit.component";
import {SkuCreatorComponent} from "./sku-creator/sku-creator.component";

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'sku',
        component: LayoutComponent,
        children: [
          {
            path: 'new',
            component: SkuCreatorComponent,
            resolve: {
              sku: SkuResolve,
            }
          },
          {
            path: 'edit/:id',
            component: SkuEditComponent,
            resolve: {
              sku: SkuResolve,
            }
          },
          {
            path: ':id',
            component: SkuDetailsComponent,
            resolve: {
              sku: SkuResolve,
            }
          },
          {
            path: '',
            component: SkuListComponent,
            resolve: {
              sku: SkuResolve,
            }
          }
        ]
      }
    ])
  ],
  providers: [
    SkuResolve
  ],
  exports: [
    RouterModule
  ]
})
export class SkuRoutingModule {
}
