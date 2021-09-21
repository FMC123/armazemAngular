import { NgModule } from '@angular/core';

import {DriverService} from './driver.service';
import {SharedModule} from "../shared/shared.module";
import {DriverRoutingModule} from "./driver-routing.module";
import {DriverAlertsListComponent} from "./driver-form/driver-alerts-list.component";
import {DriverFormComponent} from "./driver-form/driver-form.component";
import {DriverListComponent} from "./driver-list/driver-list.component";
import {DriverListInfoComponent} from "./driver-list-details/driver-list-info.component";
import {DriverDetailsComponent} from "./driver-list-details/driver-list-details.component";
import {DriverIncidentComponent} from "./driver-incident/driver-incident.component";

@NgModule({
  imports: [
    SharedModule,
    DriverRoutingModule,
  ],
  declarations: [
    DriverAlertsListComponent,
    DriverFormComponent,
    DriverListComponent,
    DriverListInfoComponent,
    DriverDetailsComponent,
    DriverIncidentComponent,
  ],
  providers: [
    DriverService,
  ]
})
export class DriverModule { }
