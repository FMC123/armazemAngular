import { TrackingStorageUnit } from '../storage-unit/tracking-storage-unit';
import { MapTrackingPositionStates } from '../map/states/map-tracking-position-states';
import { MapTrackingPosition } from '../map/map-tracking-position';

export class PositionStorageUnitSyncOrganizer {

  static organize(
    syncedStorageUnits: Array<TrackingStorageUnit>,
    positions: Array<MapTrackingPosition>,
  ) {
    this.removeStorageUnitsFromPositions(positions, syncedStorageUnits);
    let storageUnitsToAdd = syncedStorageUnits.filter((mpb) => !mpb.deletedDate );
    this.addStorageUnitsInsidePositions(positions, storageUnitsToAdd);
    MapTrackingPositionStates.organize(positions);
  }

  static addStorageUnitsInsidePositions(
    positions: Array<MapTrackingPosition>,
    storageUnits: Array<TrackingStorageUnit>,
  ) {
    storageUnits.forEach((storageUnit) => {
      let mapPosition = positions.find((position) => {
        return position.positionId === storageUnit.positionId &&
            position.stackId === storageUnit.stackId;
      });
      if (mapPosition) {
        mapPosition.storageUnits.push(storageUnit);
      }
    });
    return positions;
  }

  static removeStorageUnitsFromPositions(
    positions: Array<MapTrackingPosition>,
    storageUnits: Array<TrackingStorageUnit>,
  ) {
    storageUnits.forEach((storageUnit) => {
      positions.forEach((position) => {
        let storageUnitFound = !!position.storageUnits.find((b) => b.id === storageUnit.id);

        if (storageUnitFound) {
          position.storageUnits = position.storageUnits.filter((mpb) => mpb.id !== storageUnit.id);
        }
      });
    });

    return positions;
  }

}
