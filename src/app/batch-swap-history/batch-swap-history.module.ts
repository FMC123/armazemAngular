import {NgModule} from '@angular/core';

import {LogModule} from '../log/log.module';
import {SharedModule} from './../shared/shared.module';
import {BatchSwapHistoryRoutingModule, routedComponents} from "./batch-swap-history-routing.module";
import {BatchSwapHistoryService} from "./batch-swap-history.service";
import {BatchSwapHistoryFilterComponent} from "./batch-swap-history-list/batch-swap-history-filter.component";
import {SelectModule} from "ng2-select";

@NgModule({
  imports: [
    SharedModule,
    LogModule,
    BatchSwapHistoryRoutingModule,
    SelectModule,
  ],
  declarations: [
    ...routedComponents,
    BatchSwapHistoryFilterComponent
  ],
  providers: [
    BatchSwapHistoryService,
  ]
})
export class BatchSwapHistoryModule {
}
