import {NgModule} from "@angular/core";
import {SharedModule} from "../shared/shared.module";
import {IncidentService} from "./incident.service";

@NgModule({
  imports: [
    SharedModule,
  ],
  declarations: [

  ],
  exports: [],
  providers: [
    IncidentService,
  ]
})
export class IncidentModule {
}
