import {NgModule} from '@angular/core';

import {routing} from './dashboard.routing';
import {SharedModule} from './../shared/shared.module';
import {DashboardComponent} from './dashboard.component';
import {StockPanelModule} from './stock-panel/stock-panel.module';
import {SummaryPanelModule} from "./summary-panel/summary-panel.module";
import {PowerBiModule} from "./power-bi/power-bi.module";
import {LobbyPanelModule} from "./lobby-panel/lobby-panel.module";

@NgModule({
  imports: [SharedModule, StockPanelModule, SummaryPanelModule, LobbyPanelModule, routing, PowerBiModule],
  exports: [],
  declarations: [DashboardComponent],
  providers: []
})
export class DashboardModule {
}
