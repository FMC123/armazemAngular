import { NgModule } from '@angular/core';

import { SelectModule } from './../../../vendor/select/select.module';
import { SharedModule } from './../../shared/shared.module';
import { MapZoneLegendComponent } from './map-zone-legend/map-zone-legend.component';
import { MapZoneListComponent } from './map-zone-list/map-zone-list.component';
import { MapZoneManagerRoutingModule } from './map-zone-manager-routing.module';
import { MapZoneManagerComponent } from './map-zone-manager.component';
import { MapZoneManagerService } from './map-zone-manager.service';
import { MapZonePositionModule } from './map-zone-position/map-zone-position.module';
import { MapZoneSidebarComponent } from './map-zone-sidebar.component';

@NgModule({
  imports: [
    SharedModule,
    MapZonePositionModule,
    MapZoneManagerRoutingModule,
    SelectModule,

  ],
  declarations: [
    MapZoneManagerComponent,
    MapZoneSidebarComponent,
    MapZoneListComponent,
    MapZoneLegendComponent
  ],

  providers: [
    MapZoneManagerService,
  ]
})
export class MapZoneManagerModule { }
