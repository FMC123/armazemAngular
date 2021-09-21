import { NumberHelper } from '../../shared/globalization';
import { TrackingStorageUnit } from '../storage-unit/tracking-storage-unit';
import { TrackingBatch } from '../batch/tracking-batch';
import { TrackingService } from '../tracking.service';
import { TrackingSearchService } from '../search/tracking-search.service';
import { Component } from '@angular/core';
import { AfterViewChecked } from '@angular/core/src/metadata/lifecycle_hooks';

@Component({
  selector: 'app-tracking-results',
  templateUrl: 'tracking-results.component.html'
})

export class TrackingResultsComponent implements AfterViewChecked {

  constructor(
    private service: TrackingService,
    private searchService: TrackingSearchService,
  ) { }

  ngAfterViewChecked() {
    if (jQuery('.tracking-results').length) {
      let clientHeight = Math.max(jQuery('.map-sidebar').height(), 740);
      let max = clientHeight - jQuery('.tracking-results').position().top;
      let padding = 40;
      jQuery('.tracking-results').css('max-height', max - padding);
    }
  }

  get fullLoading() {
    return this.service.loading;
  }

  get resultedBatches() {
    const searched = batch => batch.searched;

    return this.service
      .batches
      .filter(searched)
      .slice(0, this.searchService.showResultsLimit);
  }

  toggleSelect(batch: TrackingBatch, storageUnit?: TrackingStorageUnit) {
    this.service.toggleSelect(batch, storageUnit);
  }

  toggleOrder(batch: TrackingBatch, storageUnit?: TrackingStorageUnit) {
    this.service.toggleOrder(batch, storageUnit);
  }

  get ableToIncrementShowResultsLimit() {
    return this.searchService.showResultsLimit === this.resultedBatches.length;
  }

  incrementShowResultsLimit() {
    this.searchService.incrementShowResultsLimit();
  }

}
