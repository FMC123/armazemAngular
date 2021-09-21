import { MapZones } from './map-zones';
import { Zone } from '../../zone/zone';
import { AuthService } from '../../auth/auth.service';
import { ErrorHandler } from '../../shared/errors/error-handler';
import { Notification } from './../../shared/notification/notification';
import { MapZonePositionLayer } from './map-zone-position/map-zone-position-layer';
import { MapZonePositionsService } from './map-zone-position/map-zone-positions.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';

@Component({
  selector: 'app-map-zone-manager',
  templateUrl: './map-zone-manager.component.html',
  providers: [ MapZonePositionsService, MapZones ]
})
export class MapZoneManagerComponent implements OnInit {

  constructor(
    private auth: AuthService,
    private route: ActivatedRoute,
    private positionsService: MapZonePositionsService,
    private errorHandler: ErrorHandler,
    private mapZones: MapZones,
  ) { }

  get positions(){
    return this.positionsService.positions;
  }

  ngOnInit() {
    Notification.clearErrors();
    this.route.data.forEach((data: {
      layers: Array<MapZonePositionLayer>,
      mapZones: Array<Zone>
    }) => {
      this.positionsService.positions = [];
      data.layers.forEach((layer) => {
        this.positionsService.positions = this.positionsService.positions.concat(layer.mapPositions);
      });
      this.mapZones.value = data.mapZones;
      this.positionsService.populateZones();
    });
  }

  private handleError(error){
    this.errorHandler.fromServer(error);
  }

}
