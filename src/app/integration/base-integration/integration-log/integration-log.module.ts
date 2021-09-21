import { NgModule } from '@angular/core';

import { IntegrationLogListComponent } from './integration-log-list/integration-log-list.component';
import { FunctionLogRoutingModule } from './integration-log-routing.module';
import {SharedModule} from "../../../shared/shared.module";
import { IntegrationLogFilterComponent } from './integration-log-list/integration-log-filter.component';
import { FunctionLogService } from './integration-log.service';

@NgModule({
  imports: [
    SharedModule,
    FunctionLogRoutingModule
  ],
  declarations: [
      IntegrationLogListComponent,
      IntegrationLogFilterComponent
  ],
  providers: [
    FunctionLogService,
  ]
 })
export class FunctionLogModule { }
