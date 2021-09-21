import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { AuthService } from '../auth/auth.service';
import { TrackingStorageUnit } from './storage-unit/tracking-storage-unit';
import { TrackingStorageUnitStates } from './storage-unit/states/tracking-storage-unit-states';
import { TrackingBatch } from './batch/tracking-batch';
import { TrackingBatchStates } from './batch/states/tracking-batch-states';
import { TrackingDataService } from './data/tracking-data.service';
import { MapTrackingPosition } from './map/map-tracking-position';
import { MapTrackingPositionStates } from './map/states/map-tracking-position-states';
import { TrackingSearchService } from './search/tracking-search.service';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

@Injectable()
export class TrackingService {

  initialLoading = false;
  loading = false;

  get positions(): Array<MapTrackingPosition> {
    return this.data.positions;
  }

  get storageUnits(): Array<TrackingStorageUnit> {
    return this.data.storageUnits;
  }

  get batches(): Array<TrackingBatch> {
    return this.data.batches;
  }

  constructor(
    public data: TrackingDataService,

    private http: Http,
    private auth: AuthService,
    private searchService: TrackingSearchService,
  ) {}

  init() {
    this.initialLoading = true;

    return this.data.init().then(() => {
      this.initialLoading = false;
    });
  }

  destroy() {
    this.data.destroy();
  }

  toggleSelectPosition(
    position: MapTrackingPosition,
  ) {
    this.storageUnits.forEach(storageUnit => storageUnit.selected = false);

    let batchesFromPosition = this.batches.filter(batch => position.storageUnits.some(storageUnit => storageUnit.batchCode === batch.batchCode));
    const markAsContraryToPosition = storageUnit => storageUnit.selected = !position.selected;

    batchesFromPosition.forEach(batch => {
      batch.storageUnits.forEach(markAsContraryToPosition);
    });

    TrackingBatchStates.organize(this.data.batches, this.data.storageUnits);
    MapTrackingPositionStates.organize(this.positions);

    const prioritizeFromPosition = (a, b) => {
      if (batchesFromPosition.some(bfp => bfp.id === a.id)) {
        return -1;
      }

      if (batchesFromPosition.some(bfp => bfp.id === b.id)) {
        return 1;
      }

      if (a.batchCode > b.batchCode) {
        return 1;
      }

      if (a.batchCode < b.batchCode) {
        return -1;
      }

      return 0;
    };
    this.batches.sort(prioritizeFromPosition);
}

  toggleSelect(
    batch: TrackingBatch,
    storageUnit?: TrackingStorageUnit,
  ) {
    if (storageUnit) {
      let selected = !storageUnit.selected;
      this.storageUnits.forEach(storageUnit => storageUnit.selected = false);
      storageUnit.selected = selected;
    } else {
      const markAsContraryToBatch = storageUnit => storageUnit.selected = !batch.selected;
      this.storageUnits.forEach(storageUnit => storageUnit.selected = false);
      batch
        .storageUnits
        .forEach(markAsContraryToBatch);
    }

    TrackingBatchStates.organize(this.data.batches, this.data.storageUnits);
    MapTrackingPositionStates.organize(this.positions);
  }

  toggleOrder(
    batch: TrackingBatch,
    storageUnit?: TrackingStorageUnit,
  ) {
    if (storageUnit) {
      storageUnit.ordered = !storageUnit.ordered;
    } else {
      const markAsContraryToBatch = storageUnit => storageUnit.ordered = !batch.ordered;
      batch
        .storageUnits
        .forEach(markAsContraryToBatch);
    }

    TrackingBatchStates.organize(this.data.batches, this.data.storageUnits);
    MapTrackingPositionStates.organize(this.positions);
  }

}
