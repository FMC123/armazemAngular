import {
    ServiceGroupItemPriceListComponent
} from './service-group-item-price-list/service-group-item-price-list.component';
import {
    ServiceGroupItemListComponent
} from '../service-group-items/service-group-item-list/service-group-item-list.component';
import { ServiceGroupItemPriceRoutingModule } from './service-group-item-price-routing.module';
import { ServiceGroupItemPriceService } from './service-group-item-price.service';
import {
    ServiceGroupItemPriceFormComponent
} from './service-group-item-price-form/service-group-item-price-form.component';
import { ServiceGroupService } from '../service-group/service-group.service';

import { environment } from '../../environments/environment';
import { SharedModule } from '../shared/shared.module';
import { NgModule } from '@angular/core';

const PROVIDERS = [
  ServiceGroupItemPriceService
];

@NgModule({
  imports: [
    SharedModule,
    ServiceGroupItemPriceRoutingModule
  ],
  exports: [],
  declarations: [
    ServiceGroupItemPriceFormComponent
  ],
  providers: PROVIDERS,
})
export class ServiceGroupItemPriceModule { }
