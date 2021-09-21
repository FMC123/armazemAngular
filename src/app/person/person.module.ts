import { NgModule } from '@angular/core';

import { AddressSharedModule } from '../address/address-shared.module';
import { CustomerContactSharedModule } from '../customer-contact/customer-contact-shared.module';
import { FarmSharedModule } from '../farm/farm-shared.module';
import { SharedModule } from './../shared/shared.module';
import { PersonFormComponent } from './person-form/person-form.component';
import { PersonListDetailsComponent } from './person-list-details/person-list-details.component';
import { PersonListInfoComponent } from './person-list-details/person-list-info.component';
import { PersonListComponent } from './person-list/person-list.component';
import { PersonRoutingModule } from './person-routing.module';
import { PersonService } from './person.service';

@NgModule({
  imports: [
    SharedModule,
    PersonRoutingModule,
    FarmSharedModule,
    AddressSharedModule,
    CustomerContactSharedModule,
  ],
  declarations: [
    PersonFormComponent,
    PersonListComponent,
    PersonListInfoComponent,
    PersonListDetailsComponent,
  ],
  exports: [
    PersonListInfoComponent,
    PersonListDetailsComponent,
  ],
  providers: [
    PersonService,
  ]
})
export class PersonModule { }
