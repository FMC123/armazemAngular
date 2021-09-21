import { MapZonePosition } from './map-zone-position/map-zone-position';
import { Position } from '../../position/position';
import { Zone } from '../../zone/zone';
import { Injectable } from '@angular/core';

@Injectable()
export class MapZones {
  _value: Array<Zone> = [];
  hasChangedPosition = false;
  positionsTouched = {};

  addPositionTouched(position: MapZonePosition) {
    this.hasChangedPosition = true;
    this.positionsTouched[position.positionId] = position;
  }

  saveable() {
    let value: Array<Zone> = JSON.parse(JSON.stringify(this._value));

    value.forEach((zone: Zone) => {
      zone.positions = zone.positions.filter(position => !!this.positionsTouched[position.id]);
    });

    let emptyZone = new Zone();

    emptyZone.positions = Object.keys(this.positionsTouched)
      .map(positionId => this.positionsTouched[positionId])
      .filter((position: MapZonePosition) => !position.selected)
      .map((position: MapZonePosition) => new Position(position.positionId, null, position.positionCode));

    value.push(emptyZone);

    return value;
  }

  set value(value: Array<Zone>) {
    value.forEach((v, i) => {
      v.index = i;
    });
    this._value = value;
  }

  get value() {
    return this._value;
  }
}
