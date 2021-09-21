import {NgModule} from '@angular/core';
import {SharedModule} from '../shared/shared.module';
import {ContaminantFormComponent} from './contaminant-form/contaminant-form.component';
import {ContaminantListComponent} from './contaminant-list/contaminant-list.component';
import {ContaminantRoutingModule} from './contaminant-routing.module';
import {ContaminantService} from './contaminant.service';
import {ContaminantDetailsComponent} from "./contaminant-list-details/contaminant-list-details.component";
import {ContaminantCreatorComponent} from "./contaminant-creator/contaminant-creator.component";
import {ContaminantEditComponent} from "./contaminant-edit/contaminant-edit.component";

@NgModule({
  imports: [
    SharedModule,
    ContaminantRoutingModule
  ],
  declarations: [
    ContaminantFormComponent,
    ContaminantListComponent,
    ContaminantDetailsComponent,
    ContaminantCreatorComponent,
    ContaminantEditComponent
  ],
  providers: [
    ContaminantService,
  ]
})
export class ContaminantModule {
}
