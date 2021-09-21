import { SampleTrackingBatchesService } from '../sample-tracking-batches.service';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Batch } from "../../batch/batch";
import { Subscription } from "rxjs/Subscription";
import { Observable } from "../../../../node_modules/rxjs";
import { Warehouse } from "../../warehouse/warehouse";
import { Sample } from "../../sample/sample";
import { User } from "../../user/user";

@Component({
  selector: 'app-sample-tracking-warehouse',
  templateUrl: 'sample-tracking-warehouse.component.html',
  styleUrls: ['./sample-tracking-warehouse.component.css']
})
export class SampleTrackingWarehouseComponent implements OnInit, OnDestroy {
  @Input() warehouse: Warehouse;
  @Input() samples: Array<Sample> = [];
  @Input() insert: boolean = true;

  constructor(private batchesService: SampleTrackingBatchesService) {
  }

  ngOnDestroy(): void {
  }

  ngOnInit(): void {

  }

  addOnList(sample: Sample) {
    this.batchesService.addToSelecteds(sample);
  }

  removeFromList(sample: Sample) {
    this.batchesService.removeFromSelecteds(sample);
  }

  departmentString(sample: Sample) {
    if (sample && sample.withdrawalRequestedBy && sample.withdrawalRequestedBy.department && sample.withdrawalRequestedBy.department.name)
      return sample.withdrawalRequestedBy.department.name
    else
      return "";
  }

  sumBatchesFromSample(sample: Sample) {

    let sum: number = 0;

    // com o atributo balance, não é mais necessário fazer cálculos para o peso
    //let remote = !(sample.warehouse && sample.warehouse.local);

    if (sample.batches) {
      sample.batches.forEach(batch => {

        sum += batch.balance;

        /*
        // se for remoto busca do balanço
        if (remote) {
          sum += batch.balance;
        }
        else {
          sum += batch.storageUnitBatchesQuantitySum;
        }*/

      });
    }

    return sum;
  }
}