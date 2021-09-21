import { CustomerContactDetailsComponent } from './customer-contact-list-details/customer-contact-list-details.component';
import {
    CustomerContactListSimpleDetailsComponent,
} from './customer-contact-list-simple-details/customer-contact-list-simple-details.component';
import { CustomerContactListInfoComponent } from './customer-contact-list-details/customer-contact-list-info.component';
import { CustomerContactFormComponent } from './customer-contact-form/customer-contact-form.component';
import {
    CustomerContactModalDetailsComponent,
} from './customer-contact-modal/customer-contact-modal-list-details/customer-contact-modal-list-details.component';
import {
    CustomerContactModalListInfoComponent,
} from './customer-contact-modal/customer-contact-modal-list-details/customer-contact-modal-list-info.component';
import {
    CustomerContactModalFormComponent,
} from './customer-contact-modal/customer-contact-modal-form/customer-contact-modal-form.component';
import { SharedModule } from '../shared/shared.module';
import { CustomerContactListComponent } from './customer-contact-list/customer-contact-list.component';

import { NgModule } from '@angular/core';
import { CustomerContactModalListComponent } from
'./customer-contact-modal/customer-contact-modal-list/customer-contact-modal-list.component';
import { CustomerContactModalListSimpleDetailsComponent } from
'./customer-contact-modal/customer-contact-modal-list-simple-details/customer-contact-modal-list-simple-details.component';

@NgModule({
  imports: [SharedModule],
  exports: [
    CustomerContactListComponent,
    CustomerContactModalFormComponent,
    CustomerContactModalListComponent,
    CustomerContactModalListInfoComponent,
    CustomerContactModalListSimpleDetailsComponent,
    CustomerContactModalDetailsComponent,

    CustomerContactFormComponent,
    CustomerContactListInfoComponent,
    CustomerContactListSimpleDetailsComponent,
    CustomerContactDetailsComponent,
  ],
  declarations: [
    CustomerContactListComponent,
    CustomerContactModalFormComponent,
    CustomerContactModalListComponent,
    CustomerContactModalListInfoComponent,
    CustomerContactModalListSimpleDetailsComponent,
    CustomerContactModalDetailsComponent,

    CustomerContactFormComponent,
    CustomerContactListInfoComponent,
    CustomerContactListSimpleDetailsComponent,
    CustomerContactDetailsComponent,
  ],
  providers: [],
})
export class CustomerContactSharedModule { }
