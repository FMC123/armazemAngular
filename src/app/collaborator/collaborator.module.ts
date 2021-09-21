import { NgModule } from '@angular/core';

import { AddressSharedModule } from '../address/address-shared.module';
import { CustomerContactSharedModule } from '../customer-contact/customer-contact-shared.module';
import { PersonSharedModule } from '../person/person-shared.module';
import { SharedModule } from './../shared/shared.module';
import { CollaboratorFormComponent } from './collaborator-form/collaborator-form.component';
import { collaboratorDetailsComponent } from './collaborator-list-details/collaborator-list-details.component';
import { CollaboratorListInfoComponent } from './collaborator-list-details/collaborator-list-info.component';
import { CollaboratorListComponent } from './collaborator-list/collaborator-list.component';
import { CollaboratorRoutingModule } from './collaborator-routing.module';
import { CollaboratorService } from './collaborator.service';

@NgModule({
  imports: [
    SharedModule,
    CollaboratorRoutingModule,
    PersonSharedModule,
    CustomerContactSharedModule,
    AddressSharedModule,
  ],
  declarations: [
    CollaboratorFormComponent,
    CollaboratorListComponent,
    CollaboratorListInfoComponent,
    collaboratorDetailsComponent,
  ],

  providers: [
    CollaboratorService,
  ]
})
export class CollaboratorModule { }
