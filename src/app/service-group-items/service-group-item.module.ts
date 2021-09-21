import { ServiceGroupItemInfoComponent } from './service-group-item-details/service-group-item-info.component';
import { ServiceGroupItemDetailsComponent } from './service-group-item-details/service-group-item-details.component';
import { ServiceGroupItemPriceService } from '../service-group-items-price/service-group-item-price.service';
import {
    ServiceGroupItemPriceListComponent
} from '../service-group-items-price/service-group-item-price-list/service-group-item-price-list.component';
import { ServiceGroupItemFormComponent } from './service-group-item-form/service-group-item-form.component';
import { ServiceGroupItemListComponent } from './service-group-item-list/service-group-item-list.component';
import { ServiceGroupItemRoutingModule } from './service-group-item-routing.module';
import { ServiceGroupItemService } from './service-group-item.service';
import { ServiceGroupService } from '../service-group/service-group.service';

import { environment } from '../../environments/environment';
import { SharedModule } from '../shared/shared.module';
import { NgModule } from '@angular/core';
import { ServiceGroupItemDetailsResolve } from "app/service-group-items/service-group-item-details/service-group-item-details-resolve.service";

const PROVIDERS = [
  ServiceGroupItemService
];

@NgModule({
  imports: [
    SharedModule,
    ServiceGroupItemRoutingModule
  ],
  exports: [ServiceGroupItemPriceListComponent],
  declarations: [
    ServiceGroupItemFormComponent,
    ServiceGroupItemPriceListComponent,
    ServiceGroupItemDetailsComponent,
    ServiceGroupItemInfoComponent,
  ],
  providers: PROVIDERS,
})
export class ServiceGroupItemModule { }
