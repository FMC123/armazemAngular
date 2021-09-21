import { NgModule } from '@angular/core';

import { SharedModule } from './../shared/shared.module';
import {CollaboratorPropertyFormComponent} from "./collaborator-property-form/collaborator-property-form.component";
import {CollaboratorPropertyDetailsComponent} from "./cooperator-property-list-details/collaborator-property-list-details.component";
import {CollaboratorPropertyListInfoComponent} from "./cooperator-property-list-details/collaborator-property-list-info.component";
import {CollaboratorPropertyRoutingModule} from "./collaborator-property-routing.module";
import {CollaboratorPropertyService} from "./collaborator-property.service";
import {CollaboratorPropertyListComponent} from "./collaborator-property-list/collaborator-property-list.component";

@NgModule({
  imports: [
    SharedModule,
    CollaboratorPropertyRoutingModule
  ],
  declarations: [
    CollaboratorPropertyFormComponent,
    CollaboratorPropertyListComponent,
    CollaboratorPropertyListInfoComponent,
    CollaboratorPropertyDetailsComponent
  ],
  providers: [
    CollaboratorPropertyService,
  ]
})
export class CollaboratorPropertyModule { }
