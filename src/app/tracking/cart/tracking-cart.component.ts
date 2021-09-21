import { NumberHelper } from '../../shared/globalization';
import { TrackingBatch } from '../batch/tracking-batch';
import { TrackingService } from '../tracking.service';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-tracking-cart',
  templateUrl: 'tracking-cart.component.html'
})

export class TrackingCartComponent implements OnInit {

  @Output() close: EventEmitter<void> = new EventEmitter<void>(false);

  constructor(
    private service: TrackingService,
  ) { }

  ngOnInit() { }

  get orderedBatches() {
    const ordered = batch => batch.ordered;

    return this.service
      .batches
      .filter(ordered);
  }

  get totalWeight() {
    return this.orderedBatches
      .map(batch => batch.weight)
      .reduce((a, b) => a + b, 0);
  }

  get totalWeightString() {
    return NumberHelper.toPTBR(this.totalWeight);
  }
}
