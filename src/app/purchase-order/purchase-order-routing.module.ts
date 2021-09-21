import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LayoutComponent } from 'app/layout/layout.component';
import { AuthGuard } from '../auth/auth.guard';
import { PurchaseOrderListComponent } from './purchase-order-list.component';
import { PurchaseOrderFormComponent } from './purchase-order-form.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'purchase-order',
        component: LayoutComponent,
        canActivateChild: [AuthGuard],
        children: [
          {
            path: '',
            component: PurchaseOrderListComponent
          },
          {
            path: 'new',
            component: PurchaseOrderFormComponent
          },
          {
            path: 'edit/:id',
            component: PurchaseOrderFormComponent
          },
        ]
      }
    ])
  ],
  providers: [
  ],
  exports: [
    RouterModule
  ]
})
export class PurchaseOrderRoutingModule { }