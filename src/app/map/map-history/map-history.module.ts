import { NgModule } from '@angular/core';

import { MapPositionModule } from '../map-position/map-position.module';
import { SharedModule } from './../../shared/shared.module';
import { MapHistoryDateComponent } from './map-history-date/map-history-date.component';
import { MapHistoryDetailsComponent } from './map-history-details/map-history-details.component';
import { MapHistoryLogComponent } from './map-history-log/map-history-log.component';
import { MapHistoryRoutingModule } from './map-history-routing.module';
import { MapHistoryServerService } from './map-history-server.service';
import { MapHistorySidebarComponent } from './map-history-sidebar.component';
import { MapHistoryComponent } from './map-history.component';

@NgModule({
  imports: [
    SharedModule,
    MapPositionModule,
    MapHistoryRoutingModule
  ],
  declarations: [
    MapHistoryComponent,
    MapHistorySidebarComponent,
    MapHistoryDetailsComponent,
    MapHistoryDateComponent,
    MapHistoryLogComponent,
  ],
  providers: [
    MapHistoryServerService,
  ]
})
export class MapHistoryModule { }
