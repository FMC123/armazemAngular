import { NgModule } from '@angular/core';

import { SharedModule } from './../shared/shared.module';
import { ItemChildrenListComponent } from './item-form/item-children-list.component';
import { ItemFormComponent } from './item-form/item-form.component';
import { ItemDetailsComponent } from './item-list-details/item-list-details.component';
import { ItemListInfoComponent } from './item-list-details/item-list-info.component';
import { ItemListComponent } from './item-list/item-list.component';
import { ServiceItemRoutingModule } from './service-item-routing.module';
import { ServiceItemService } from './service-item.service';

@NgModule({
  imports: [
    SharedModule,
    ServiceItemRoutingModule,
  ],
  declarations: [
    ItemChildrenListComponent,
    ItemFormComponent,
    ItemListComponent,
    ItemListInfoComponent,
    ItemDetailsComponent,
  ],

  providers: [
    ServiceItemService,
  ]
})
export class ServiceItemModule { }
