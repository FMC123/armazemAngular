import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { PurchaseOrderRoutingModule } from './purchase-order-routing.module';
import { PurchaseOrderListComponent } from './purchase-order-list.component';
import { PurchaseOrderService } from './purchase-order.service';
import { PurchaseOrderFormComponent } from './purchase-order-form.component';

@NgModule({
  imports: [
    SharedModule,
    PurchaseOrderRoutingModule
  ],
  declarations: [
    PurchaseOrderListComponent,
    PurchaseOrderFormComponent
  ],
  providers: [
    PurchaseOrderService,
  ]
})
export class PurchaseOrderModule { }