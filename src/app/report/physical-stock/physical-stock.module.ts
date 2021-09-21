import { NgModule } from '@angular/core';

import { SharedModule } from '../../shared/shared.module';
import { PhysicalStockService } from 'app/report/physical-stock/physical-stock.service';


@NgModule({
  imports: [
    SharedModule
  ],

  declarations: [

  ],
  providers: [PhysicalStockService],
})
export class PhysicalStockModule { }
