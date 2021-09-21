import {Component, OnInit, Input} from '@angular/core';

import {Notification} from '../../shared/notification';
import {BatchReportComponent} from '../batch-report.component';
import {Batch} from "../../batch/batch";
import {BatchService} from "../../batch/batch.service";

@Component({
  selector: 'app-batch-report-exchange',
  templateUrl: 'batch-report-exchange.component.html'
})

export class BatchReportExchangeComponent implements OnInit {
  @Input() parent: BatchReportComponent;
  @Input() batch: Batch;
  loading: boolean;
  exchanges: Array<any> = [];

  constructor(private batchService: BatchService) {
  }

  ngOnInit() {
    Notification.clearErrors();
    this.loadList();
  }

  private loadList() {
    this.batchService.loadBatchSwapData(this.batch.id).then((res) => {
      let obj = {};
      for (let i of res) {
        let d = new Date(i.createdDate).toISOString().slice(0, 10);
        obj[i.originBatch.id + i.destinationBatch.id + d] = obj[i.originBatch.id + i.destinationBatch.id + d] || [];
        obj[i.originBatch.id + i.destinationBatch.id + d].push(i.tag)
      }
      for (let i of res) {
        let d = new Date(i.createdDate).toISOString().slice(0, 10);
        i.tags = obj[i.originBatch.id + i.destinationBatch.id + d];
      }

      let exchanges = [];
      let duplicates = {};
      for (let i of res) {
        let d = new Date(i.createdDate).toISOString().slice(0, 10);
        let id = i.originBatch.id + i.destinationBatch.id + d;
        if (!duplicates[id]) {
          duplicates[id] = i;
          exchanges.push(i);
        }
      }
      this.exchanges = exchanges;
    });
  }

}
