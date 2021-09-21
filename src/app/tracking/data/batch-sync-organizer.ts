import { UnavailableBatchWeight } from '../batch/unavailable-batch-weight';
import { TrackingStorageUnit } from '../storage-unit/tracking-storage-unit';
import { TrackingBatch } from '../batch/tracking-batch';
import { MapPositionStorageUnit } from '../../map/map-position/map-position-storage-unit';
import { MapTrackingPosition } from '../map/map-tracking-position';

export class BatchSyncOrganizer {

  static organize(
    batches: Array<TrackingBatch>,
    syncedBatches: Array<TrackingBatch>,
    storageUnits: Array<TrackingStorageUnit>,
    unavailableWeights: Array<UnavailableBatchWeight>,
  ) {
    batches = this.removeSyncedFromCurrentList(batches, syncedBatches, storageUnits);
    let batchesToAdd = syncedBatches.filter((mpb) => !mpb.deletedDate );
    batches = batches.concat(batchesToAdd);
    this.fillWithStorageUnits(batches, storageUnits);
    this.calculateWeight(batches, unavailableWeights);
    batches = batches.filter(batch => batch.weight > 0);
    return batches;
  }

  static removeSyncedFromCurrentList(
    batches: Array<TrackingBatch>,
    syncedBatches: Array<TrackingBatch>,
    storageUnits: Array<TrackingStorageUnit>,
  ) {
    return batches.filter(batch => {
      return !syncedBatches.some(syncedBatch => syncedBatch.id === batch.id);
    });
  }

  static fillWithStorageUnits(
    batches: Array<TrackingBatch>,
    storageUnits: Array<TrackingStorageUnit>,
  ) {
    batches.forEach(batch => {
      batch.storageUnits = storageUnits.filter(b => b.batchCode === batch.batchCode);
    });
  }

  static calculateWeight(
    batches: Array<TrackingBatch>,
    unavailableWeights: Array<UnavailableBatchWeight>,
  ) {
    batches.forEach(batch => {
      // sum storageUnits
      batch.weight = batch
        .storageUnits
        .map(storageUnit => storageUnit.initialWeight || 0)
        .reduce((a, b) => a + b, 0);

      // discount unavailable weights
      batch.weight -= unavailableWeights
        .filter(uw => uw.batchId === batch.id)
        .map(uw => uw.unavailableWeight || 0)
        .reduce((a, b) => a + b, 0) || 0;
    });
  }

}
