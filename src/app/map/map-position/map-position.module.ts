import { NgModule } from '@angular/core';

import { SharedModule } from '../../shared/shared.module';
import { MapPositionResolve } from './map-position-resolve.service';
import { MapPositionServerService } from './map-position-server.service';
import { MapPositionsComponent } from './map-positions.component';

@NgModule({
  imports: [
    SharedModule
  ],
  exports: [MapPositionsComponent],
  declarations: [MapPositionsComponent],
  providers: [
    MapPositionServerService,
    MapPositionResolve
  ]
})
export class MapPositionModule { }
