import { AddressListSimpleDetailsComponent } from './address-list-simple-details/address-list-simple-details.component';
import { AddressDetailsComponent } from './address-list-details/address-list-details.component';
import { AddressListInfoComponent } from './address-list-details/address-list-info.component';
import { AddressFormComponent } from './address-form/address-form.component';
import {
    AddressModalListSimpleDetailsComponent,
} from './address-modal/address-modal-list-simple-details/address-modal-list-simple-details.component';
import {
    AddressModalDetailsComponent,
} from './address-modal/address-modal-list-details/address-modal-list-details.component';
import { PersonModalService } from '../person/person-modal/person-modal.service';
import { AddressModalListInfoComponent } from './address-modal/address-modal-list-details/address-modal-list-info.component';
import { AddressModalListComponent } from './address-modal/address-modal-list/address-modal-list.component';
import { AddressModalFormComponent } from './address-modal/address-modal-form/address-modal-form.component';
import { SharedModule } from '../shared/shared.module';
import { AddressListComponent } from './address-list/address-list.component';

import { NgModule } from '@angular/core';

@NgModule({
  imports: [SharedModule],
  exports: [
    AddressListComponent,
    AddressModalFormComponent,
    AddressModalListComponent,
    AddressModalListInfoComponent,
    AddressModalDetailsComponent,
    AddressModalListSimpleDetailsComponent,

    AddressFormComponent,
    AddressListInfoComponent,
    AddressDetailsComponent,
    AddressListSimpleDetailsComponent,
  ],
  declarations: [
    AddressListComponent,
    AddressModalFormComponent,
    AddressModalListComponent,
    AddressModalListInfoComponent,
    AddressModalDetailsComponent,
    AddressModalListSimpleDetailsComponent,

    AddressFormComponent,
    AddressListInfoComponent,
    AddressDetailsComponent,
    AddressListSimpleDetailsComponent,
  ],
})
export class AddressSharedModule { }
