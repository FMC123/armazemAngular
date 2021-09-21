import { ErrorHandler } from '../../../shared/errors/error-handler';
import { AppState } from '../../../app-state.service';
import { MapZoneManagerService } from '../map-zone-manager.service';
import { MapZones } from '../map-zones';
import { Zone } from '../../../zone/zone';
import { Colors } from '../../../color/colors';
import { Notification } from './../../../shared/notification/notification';

import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-map-zone-legend',
  templateUrl: './map-zone-legend.component.html'
})

export class MapZoneLegendComponent implements OnInit {
  private colors = new Colors();
  private colorList: Array<any> = [];

  constructor(
    private appState: AppState,
    private mapZones: MapZones,
    private mapZoneManagerService: MapZoneManagerService,
    private errorHandler: ErrorHandler,
  ) { }

  get hasChangedPosition() {
    return this.mapZones.hasChangedPosition;
  }

  get listZone() {
    return this.mapZones.value.filter(mz => !!mz.id);
  }

  ngOnInit() {
    this.colors.value.forEach(c => {
      this.colorList.push(c);
    });
  }

  save() {
    this.appState.setLoading(true);
    this.mapZoneManagerService
      .save(this.mapZones.saveable())
      .then(() => {
        this.mapZones.hasChangedPosition = false;
        this.appState.setLoading(false);
        Notification.success('Zonas do mapa salvas com sucesso!');
      })
      .catch((err) => {
        this.appState.setLoading(false);
        this.errorHandler.fromServer(err);
      });
  }

}



