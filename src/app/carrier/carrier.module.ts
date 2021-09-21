import { NgModule } from '@angular/core';

import { AddressSharedModule } from '../address/address-shared.module';
import { CustomerContactSharedModule } from '../customer-contact/customer-contact-shared.module';
import { PersonSharedModule } from '../person/person-shared.module';
import { SharedModule } from './../shared/shared.module';
import { CarrierChildrenListComponent } from './carrier-form/carrier-children-list.component';
import { CarrierFormComponent } from './carrier-form/carrier-form.component';
import { CarrierDetailsComponent } from './carrier-list-details/carrier-list-details.component';
import { CarrierListInfoComponent } from './carrier-list-details/carrier-list-info.component';
import { CarrierListComponent } from './carrier-list/carrier-list.component';
import { CarrierRoutingModule } from './carrier-routing.module';
import { CarrierService } from './carrier.service';

@NgModule({
  imports: [
    SharedModule,
    CarrierRoutingModule,
    PersonSharedModule,
    CustomerContactSharedModule,
    AddressSharedModule,
  ],
  declarations: [
    CarrierChildrenListComponent,
    CarrierFormComponent,
    CarrierListComponent,
    CarrierListInfoComponent,
    CarrierDetailsComponent,
  ],

  providers: [
    CarrierService,
  ]
})
export class CarrierModule { }
