import { NgModule } from '@angular/core';

import { SharedModule } from './../shared/shared.module';
import { PurchaseProspectDetailsComponent } from './purchase-prospect-details/purchase-prospect-details.component';
import { PurchaseProspectInfoComponent } from './purchase-prospect-details/purchase-prospect-info.component';
import { PurchaseProspectFormComponent } from './purchase-prospect-form/purchase-prospect-form.component';
import { PurchaseProspectListComponent } from './purchase-prospect-list/purchase-prospect-list.component';
import { PurchaseProspectListFilterComponent } from './purchase-prospect-list/purchase-prospect-list-filter.component';
import { PurchaseProspectBatchsComponent } from './purchase-prospect-batchs/purchase-prospect-batchs.component';
import { PurchaseProspectRoutingModule } from './purchase-prospect-routing.module';
import { PurchaseProspectService } from './purchase-prospect.service';

@NgModule({
  imports: [
    SharedModule,
    PurchaseProspectRoutingModule,
  ],
  declarations: [
    PurchaseProspectFormComponent,
    PurchaseProspectListComponent,
    PurchaseProspectListFilterComponent,
    PurchaseProspectBatchsComponent,
    PurchaseProspectDetailsComponent,
    PurchaseProspectInfoComponent,
  ],
  providers: [PurchaseProspectService]
})
export class PurchaseProspectModule { }
