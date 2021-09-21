import { TrackingBatch } from '../../batch/tracking-batch';
import { TrackingStorageUnit } from '../../storage-unit/tracking-storage-unit';
import { TrackingService } from '../../tracking.service';
import { NumberHelper } from '../../../shared/globalization';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-tracking-cart-button',
  templateUrl: 'tracking-cart-button.component.html'
})

export class TrackingCartButtonComponent implements OnInit {

  @Output() open = new EventEmitter<void>();

  constructor(
    private service: TrackingService,
  ) { }

  ngOnInit() { }

  get cartWeightString() {
    return NumberHelper.toPTBR(this.cartWeight);
  }

  get cartWeight() {
    const ordered = (batch: TrackingBatch) => !!batch.ordered;
    return this.service
      .batches
      .filter(ordered)
      .map(batch => batch.weight)
      .reduce((a, b) => a + b, 0);
  }

}
