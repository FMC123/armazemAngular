import { NgModule } from '@angular/core';

import { SharedModule } from '../../../shared/shared.module';
import { MapZonePositionServerService } from './map-zone-position-server.service';
import { MapZonePositionsComponent } from './map-zone-positions.component';

@NgModule({
  imports: [
    SharedModule
  ],

  exports: [MapZonePositionsComponent],
  declarations: [MapZonePositionsComponent],
  providers: [
    MapZonePositionServerService,
  ]
})
export class MapZonePositionModule { }
