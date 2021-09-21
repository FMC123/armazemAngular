import { TrackingStorageUnitStates } from '../../storage-unit/states/tracking-storage-unit-states';
import { MapTrackingPosition } from '../map-tracking-position';
import { MapTrackingPositionStateSelected } from './map-tracking-position-state-selected';
import { MapTrackingPositionStateOrdered } from './map-tracking-position-state-ordered';
import { MapTrackingPositionStateSearched } from './map-tracking-position-state-searched';
import { MapTrackingPositionStateFilled } from './map-tracking-position-state-filled';
import { MapTrackingPositionStateBlank } from './map-tracking-position-state-blank';

export class MapTrackingPositionStates {

  static blank = new MapTrackingPositionStateBlank();
  static filled = new MapTrackingPositionStateFilled();
  static searched = new MapTrackingPositionStateSearched();
  static ordered = new MapTrackingPositionStateOrdered();
  static selected = new MapTrackingPositionStateSelected();

  static organize (
    positions: Array<MapTrackingPosition>,
  ) {
    positions.forEach(position => {
      const storageUnits = position.storageUnits;
      if (!storageUnits || storageUnits.length === 0) {
        position.ordered = false;
        position.selected = false;
        position.searched = false;
      }

      position.ordered = storageUnits.some(storageUnit => storageUnit.ordered);
      position.selected = storageUnits.some(storageUnit => storageUnit.selected);
      position.searched = storageUnits.some(storageUnit => storageUnit.searched);
    });
  }

}
