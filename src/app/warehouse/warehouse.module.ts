import { NgModule } from '@angular/core';

import { AddressSharedModule } from '../address/address-shared.module';
import { CustomerContactSharedModule } from '../customer-contact/customer-contact-shared.module';
import { PersonSharedModule } from '../person/person-shared.module';
import { PersonModule } from '../person/person.module';
import { SharedModule } from './../shared/shared.module';
import { WarehouseChildrenListComponent } from './warehouse-form/warehouse-children-list.component';
import { WarehouseFormComponent } from './warehouse-form/warehouse-form.component';
import { WarehouseDetailsComponent } from './warehouse-list-details/warehouse-list-details.component';
import { WarehouseListInfoComponent } from './warehouse-list-details/warehouse-list-info.component';
import { WarehouseListComponent } from './warehouse-list/warehouse-list.component';
import { WarehouseRoutingModule } from './warehouse-routing.module';
import { WarehouseService } from './warehouse.service';
import {WarehouseStakeholderModule} from "../warehouse-stakeholder/warehouse-stakeholder.module";

@NgModule({
  imports: [
    SharedModule,
    WarehouseRoutingModule,
    PersonSharedModule,
    CustomerContactSharedModule,
    AddressSharedModule,
    PersonModule,
    WarehouseStakeholderModule,
  ],
  declarations: [
    WarehouseChildrenListComponent,
    WarehouseFormComponent,
    WarehouseListComponent,
    WarehouseListInfoComponent,
    WarehouseDetailsComponent,
  ],
  providers: [
    WarehouseService,
  ]
})
export class WarehouseModule { }
