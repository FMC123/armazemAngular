import { MapZonesResolve } from './map-zones-resolve.service';
import { AuthGuard } from '../../auth/auth.guard';
import { MapZoneManagerComponent } from './map-zone-manager.component';
import { MapZonePositionResolve } from './map-zone-position/map-zone-position-resolve.service';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'map-zone-manager',
        canActivate: [ AuthGuard ],
        component: MapZoneManagerComponent,
        resolve: {
          layers: MapZonePositionResolve,
          mapZones: MapZonesResolve,
        }
      }
    ])
  ],
  providers: [
    MapZonesResolve,
    MapZonePositionResolve,
  ],
  exports: [
    RouterModule
  ]
})
export class MapZoneManagerRoutingModule { }
