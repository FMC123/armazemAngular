import { NgModule } from '@angular/core';
import {IntegrationProcafeRoutingModule} from "./integration-procafe-routing.module";
import {SharedModule} from "../../shared/shared.module";
import {IntegrationProcafeListComponent} from "./integration-procafe-list/integration-procafe-list.component";

@NgModule({
  imports: [
    SharedModule,
    IntegrationProcafeRoutingModule
  ],
  declarations: [
    IntegrationProcafeListComponent
  ],
})
export class IntegrationProcafeModule { }
