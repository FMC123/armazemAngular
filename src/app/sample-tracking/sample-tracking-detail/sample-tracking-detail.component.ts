import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { Notification } from "../../shared/notification";
import { SampleTracking } from "../sample-tracking";
import { SampleTrackingService } from '../sample-tracking.service';
import { KilosSacksConverterService } from 'app/shared/kilos-sacks-converter/kilos-sacks-converter.service';
import { Sample } from 'app/sample/sample';

@Component({
  selector: 'app-sample-tracking-detail',
  templateUrl: 'sample-tracking-detail.component.html',
  providers: []
})
export class SampleTrackingDetailComponent implements OnInit {
  sampleTracking: SampleTracking;

  constructor(private route: ActivatedRoute, private sampleTrackingService: SampleTrackingService, private kilosSacksConverterService: KilosSacksConverterService) { }

  ngOnInit() {
    Notification.clearErrors();
    this.route.data.forEach((data: { sampleTracking: SampleTracking }) => {
      this.sampleTracking = data.sampleTracking;
    });
  }


  calculateTotalSacks(sample: Sample): Number {

    // com o atributo balance, não é mais necessário fazer cálculos para o peso
    //let remote = !(sample.warehouse && sample.warehouse.local);

    let totalSacks = sample.batches.reduce((total, batch) => {

      return total += this.kilosSacksConverterService.kilosToSacks(batch.balance, batch);

      /*if (remote) {
        return total += this.kilosSacksConverterService.kilosToSacks(batch.balance, batch);
      }
      else {
        return total += this.kilosSacksConverterService.kilosToSacks(batch.storageUnitBatchesQuantitySum, batch);
      }*/

    }, 0);

    return totalSacks;
  }

  calculateTotalQuantity(sample: Sample): Number {

    // com o atributo balance, não é mais necessário fazer cálculos para o peso
    //let remote = !(sample.warehouse && sample.warehouse.local);

    let totalQuantity = sample.batches.reduce((total, batch) => {

      return total += batch.balance;

      /*
      if (remote) {
        return total += batch.balance;
      }
      else {
        return total += batch.storageUnitBatchesQuantitySum;
      }*/

    }, 0);

    return totalQuantity;
  }
}
