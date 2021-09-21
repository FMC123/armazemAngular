import { TrackingBatchStateSearchedOrdered } from './tracking-batch-state-searched-ordered';
import { TrackingStorageUnitStates } from '../../storage-unit/states/tracking-storage-unit-states';
import { TrackingBatchStateSelectedSearched } from './tracking-batch-state-selected-searched';
import { TrackingBatchStateSelectedOrdered } from './tracking-batch-state-selected-ordered';
import { TrackingBatchStateSearched } from './tracking-batch-state-searched';
import { TrackingBatchStateOrdered } from './tracking-batch-state-ordered';
import { TrackingBatchState } from './tracking-batch-state';
import { TrackingBatchStateBlank } from './tracking-batch-state-blank';
import { TrackingStorageUnit } from '../../storage-unit/tracking-storage-unit';
import { TrackingBatch } from '../tracking-batch';

export class TrackingBatchStates {

  static blank = new TrackingBatchStateBlank();
  static ordered = new TrackingBatchStateOrdered();
  static searched = new TrackingBatchStateSearched();
  static selectedSearched = new TrackingBatchStateSelectedSearched();
  static selectedOrdered = new TrackingBatchStateSelectedOrdered();
  static searchedOrdered = new TrackingBatchStateSearchedOrdered();

  static organize(
    batches: Array<TrackingBatch>,
    storageUnits: Array<TrackingStorageUnit>,
  ) {
    batches.forEach(batch => {
      const storageUnitsFromBatch = storageUnits.filter(storageUnit => storageUnit.batchCode === batch.batchCode);

      if (!storageUnitsFromBatch || storageUnitsFromBatch.length === 0) {
        batch.selected = false;
        batch.searched = false;
        batch.ordered = false;
        return;
      }

      batch.searched = storageUnitsFromBatch.some(storageUnit => storageUnit.searched);
      batch.selected = storageUnitsFromBatch.some(storageUnit => storageUnit.selected);
      batch.ordered = storageUnitsFromBatch.some(storageUnit => storageUnit.ordered);
    });
  }

}
