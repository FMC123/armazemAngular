import { EventEmitter, Injectable } from '@angular/core';

import { Colors } from '../../../color/colors';
import { Position } from '../../../position/position';
import { Zone } from '../../../zone/zone';
import { MapZones } from '../map-zones';
import { MapZonePosition } from './map-zone-position';

@Injectable()
export class MapZonePositionsService {
  public positionSelected: EventEmitter<void> = new EventEmitter<void>(false);
  private colors = new Colors();
  public positions: Array<MapZonePosition>;
  public selectedZone: Zone;

  constructor(
    private mapZones: MapZones,
  ) { }

  get listZone() {
    return this.mapZones.value;
  }

  selectZone(zone: Zone) {
    this.selectedZone = zone;
  }

  get selectedColor() {
    return this.colors.value[this.selectedZone.index];
  }

  selectPositionFrom(position: MapZonePosition) {
    if (position) {
      position.selected = true;
    }
  }

  togglePosition(position: MapZonePosition) {
    if (!this.selectedZone) {
      return;
    }

    this.mapZones.addPositionTouched(position);

    if (position.selected) {
      if (this.selectedZone.positions) {
        let belongsToSelectedZone = !!this.selectedZone.positions.find(p => p.id === position.positionId);
        if (!belongsToSelectedZone) {
          return;
        }
      }

      const nonClickedPosition = p => p.id !== position.positionId;
      this.selectedZone.positions = this.selectedZone.positions.filter(nonClickedPosition);

      this.positions.filter(p => p.positionId === position.positionId).forEach(p => {
        p.selected = false;
        p.color = null;
      });
    } else {
      let inZonePosition = new Position();
      inZonePosition.id = position.positionId;
      inZonePosition.code = position.positionCode;
      this.selectedZone.positions.push(inZonePosition);

      this.positions.filter(p => p.positionId === position.positionId).forEach(p => {
        p.selected = true;
        p.color = this.selectedColor;
      });
    }
  }

  public populateZones() {
    this.positions.forEach((position: MapZonePosition) => {
      this.listZone.forEach(zone => {
        zone.positions.forEach((zonePosition: Position) => {
          if (zonePosition.id === position.positionId) {
            position.selected = true;
            position.color = this.colors.value[zone.index];
          }
        });
      });
    });
  }

}
