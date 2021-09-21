import { NgModule } from '@angular/core';

import { SharedModule } from '../../shared/shared.module';
import { StorageUnitSharedModule } from '../../storage-unit/storage-unit-shared.module';
import { MapPositionModule } from '../map-position/map-position.module';
import { MapRealtimeDetailsComponent } from './map-realtime-details/map-realtime-details.component';
import {
  MapRealtimeMarkupGroupFormComponent,
} from './map-realtime-markup-group/form/map-realtime-markup-group-form.component';
import { MapRealtimeMarkupGroupComponent } from './map-realtime-markup-group/map-realtime-markup-group.component';
import { MapRealtimeRoutingModule } from './map-realtime-routing.module';
import { MapRealtimeSearchComponent } from './map-realtime-search/map-realtime-search.component';
import { MapRealtimeServerService } from './map-realtime-server.service';
import { MapRealtimeSidebarComponent } from './map-realtime-sidebar.component';
import { MapRealtimeComponent } from './map-realtime.component';
import { MapRealtimeService } from './map-realtime.service';

@NgModule({
  imports: [
    SharedModule,
    MapPositionModule,
    MapRealtimeRoutingModule,
    StorageUnitSharedModule,
  ],
  declarations: [
    MapRealtimeComponent,
    MapRealtimeSidebarComponent,
    MapRealtimeSearchComponent,
    MapRealtimeDetailsComponent,
    MapRealtimeMarkupGroupComponent,
    MapRealtimeMarkupGroupFormComponent,
  ],
  providers: [
    MapRealtimeServerService,
    MapRealtimeService,
  ]
})
export class MapRealtimeModule { }
