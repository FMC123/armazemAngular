import { NgModule } from '@angular/core';
import { SelectModule } from 'ng2-select/select/select.module';

import { SharedModule } from '../shared/shared.module';
import {
  PackStockMovementFormModalComponent,
} from './pack-stock-form/movement/form/pack-stock-movement-form-modal.component';
import { PackStockMovementListComponent } from './pack-stock-form/movement/list/pack-stock-movement-list.component';
import { PackStockListFilterComponent } from './pack-stock-list/pack-stock-list-filter.component';
import { PackStockRoutingModule, routedComponents } from './pack-stock-routing.module';
import { PackStockService } from './pack-stock.service';

@NgModule({
  imports: [
    SharedModule,
    PackStockRoutingModule,
    SelectModule,
  ],
  exports: [
    PackStockMovementListComponent,
  ],
  declarations: [
    ...routedComponents,
    PackStockListFilterComponent,
    PackStockMovementFormModalComponent,
    PackStockMovementListComponent,
  ],
  providers: [PackStockService]
})
export class PackStockModule { }
