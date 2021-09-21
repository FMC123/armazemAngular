import { TrackingStorageUnit } from '../storage-unit/tracking-storage-unit';
import { TrackingBatch } from '../batch/tracking-batch';
import { TrackingBatchStates } from '../batch/states/tracking-batch-states';
import { MapTrackingPosition } from '../map/map-tracking-position';
import { MapTrackingPositionStates } from '../map/states/map-tracking-position-states';
import { TrackingSearchFilter } from './tracking-search-filter';
import { Injectable } from '@angular/core';

@Injectable()
export class TrackingSearchService {

  showResultsLimit = 10;

  constructor() { }

  search(
    filter: TrackingSearchFilter,
    batches: Array<TrackingBatch>,
    storageUnits: Array<TrackingStorageUnit>,
    positions: Array<MapTrackingPosition>,
  ) {
    this.reset(batches, storageUnits, positions);

    let batchesFound = batches;

    if (filter.batchCode) {
      batchesFound = batchesFound.filter(batch => filter.batchCode === batch.batchCode);
    }

    const stringIncludedFilter = (propertyName, search) => {
      return (item) => {
        if (!search) {
          return false;
        }

        if (!item[propertyName]) {
          return false;
        }

        return item[propertyName].toUpperCase().includes(search.toUpperCase());
      };
    };

    if (filter.classificationColour) {
       batchesFound = batchesFound.filter(stringIncludedFilter('classificationColour', filter.classificationColour));
    }

    if (filter.classificationBean) {
       batchesFound = batchesFound.filter(stringIncludedFilter('classificationBean', filter.classificationBean));
    }

    if (filter.classificationBeverage) {
       batchesFound = batchesFound.filter(stringIncludedFilter('classificationBeverage', filter.classificationBeverage));
    }

    if (filter.classificationBeverageComplement) {
       batchesFound = batchesFound.filter(stringIncludedFilter('classificationBeverageComplement', filter.classificationBeverageComplement));
    }

    if (filter.classificationPattern) {
       batchesFound = batchesFound.filter(stringIncludedFilter('classificationPattern', filter.classificationPattern));
    }

    const matchesBatchFound = (storageUnit: TrackingStorageUnit) => batchesFound.some(batch => batch.batchCode === storageUnit.batchCode);

    storageUnits
      .filter(matchesBatchFound)
      .forEach(storageUnit => storageUnit.searched = true);

    TrackingBatchStates.organize(batchesFound, storageUnits);
    MapTrackingPositionStates.organize(positions);
  }

  reset(
    batches: Array<TrackingBatch>,
    storageUnits: Array<TrackingStorageUnit>,
    positions: Array<MapTrackingPosition>,
  ) {
    this.resetShowResultsLimit();

    storageUnits.forEach(storageUnit => {
      storageUnit.selected = false;
      storageUnit.searched = false;
    });

    TrackingBatchStates.organize(batches, storageUnits);
    MapTrackingPositionStates.organize(positions);
  }

  incrementShowResultsLimit() {
    this.showResultsLimit += 10;
  }

  resetShowResultsLimit() {
    this.showResultsLimit = 10;
  }

}
