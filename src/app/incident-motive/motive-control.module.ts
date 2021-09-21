import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { IncidentMotiveDetailsComponent } from './incident-motive-list-details/incident-motive-list-details.component';
import { IncidentMotiveRoutingModule } from './motive-control-routing.module';
import { IncidentMotiveService } from './motive-control.service';
import { IncidentMotiveChildrenListComponent } from './incident-motive-form/incident-motive-children-list.component';
import { IncidentMotiveFormComponent } from './incident-motive-form/incident-motive-form.component';
import { IncidentMotiveComponent } from './incident-motive-list/incident-motive.component';
import { IncidentMotiveListInfoComponent } from './incident-motive-list-details/incident-motive-list-info-component';

@NgModule({
  imports: [
    SharedModule,
    IncidentMotiveRoutingModule,


  ],
  declarations: [
    IncidentMotiveChildrenListComponent,
    IncidentMotiveFormComponent,
    IncidentMotiveComponent,
    IncidentMotiveListInfoComponent,
    IncidentMotiveDetailsComponent

  ],

  providers: [
    IncidentMotiveService,
  ]
})
export class IncidentMotiveModule { }
