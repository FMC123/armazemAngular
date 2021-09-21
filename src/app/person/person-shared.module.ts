import { PersonListInfoComponent } from './person-list-details/person-list-info.component';
import { PersonListDetailsComponent } from './person-list-details/person-list-details.component';
import { EconomicGroupModule } from '../economic-group/economic-group.module';
import { PersonMemoryService } from './person-memory.service';
import { AddressSharedModule } from '../address/address-shared.module';
import { PersonModalListInfoComponent } from './person-modal/person-modal-list-details/person-modal-list-info.component';
import {PersonModalListDetailsComponent,
} from './person-modal/person-modal-list-details/person-modal-list-details.component';
import { CustomerContactSharedModule } from '../customer-contact/customer-contact-shared.module';
import { PersonModalFormComponent } from './person-modal/person-modal-form/person-modal-form.component';
import { PersonModalListComponent } from './person-modal/person-modal-list/person-modal-list.component';
import { PersonModalService } from './person-modal/person-modal.service';
import { PersonModalComponent } from './person-modal/person-modal.component';
import { PersonModalFindComponent } from './person-modal/person-modal-find/person-modal-find.component';
import { SharedModule } from '../shared/shared.module';
import { NgModule } from '@angular/core';

@NgModule({
  imports: [
    SharedModule,
    CustomerContactSharedModule,
    AddressSharedModule,
    EconomicGroupModule,
  ],
  exports: [
    PersonModalComponent,
    PersonModalFindComponent,
  ],
  declarations: [
    PersonModalComponent,
    PersonModalListComponent,
    PersonModalFormComponent,
    PersonModalFindComponent,
    PersonModalListDetailsComponent,
    PersonModalListInfoComponent,
  ],
  providers: [
    PersonModalService,
    PersonMemoryService,
  ],
})
export class PersonSharedModule { }
