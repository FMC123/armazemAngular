import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { TransportationSharedModule } from '../transportation/transportation-shared.module';
import { PurchaseForecastFilterComponent } from './purchase-forecast-list/purchase-forecast-filter.component';
import { PurchaseForecastListComponent } from './purchase-forecast-list/purchase-forecast-list.component';
import { PurchaseForecastRoutingModule, routedComponents } from './purchase-forecast-routing.module';
import { PurchaseForecastService } from './purchase-forecast.service';

@NgModule({
  imports: [
    SharedModule,
    PurchaseForecastRoutingModule,
    TransportationSharedModule,
  ],
  exports: [],
  declarations: [
    ...routedComponents,
    PurchaseForecastListComponent,
    PurchaseForecastFilterComponent,
  ],
  providers: [
    PurchaseForecastService,
  ]
})
export class PurchaseForecastModule { }
