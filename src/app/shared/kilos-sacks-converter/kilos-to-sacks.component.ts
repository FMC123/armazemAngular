import { Component, OnInit, Input } from '@angular/core';
import { KilosSacksConverterService } from './kilos-sacks-converter.service';
import { InputPackagingStockAvailableComponent } from 'app/input-packaging-stock-available/input-packaging-stock-available-form/input-packaging-stock-available-form.component';
import { Batch } from 'app/batch/batch';

@Component({
  selector: 'app-kilos-to-sacks',
  template: `<span *ngIf="raw">{{ sacks }}</span><span *ngIf="!raw">({{ sacks }} SC)</span>`
})

export class KilosToSacksComponent implements OnInit {
  @Input() value = 0;
  @Input() raw = false;
  @Input() batch: Batch = null;

  constructor(
    private service: KilosSacksConverterService,
  ) { }

  ngOnInit() { }

  get sacks() {
    return this.service.kilosToSacks(this.value, this.batch);
  }
}
