import { BatchReportService } from './batch-report.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { BatchReportSearchComponent } from './search/batch-report-search.component';
import {AuthService} from "../auth/auth.service";
import {Batch} from "../batch/batch";

@Component({
  selector: 'app-batch-report',
  templateUrl: 'batch-report.component.html'
})

export class BatchReportComponent implements OnInit {
  selectedBatch : Batch;
  haveBatch : boolean = false;
  @ViewChild('searchComponent') searchComponent : BatchReportSearchComponent;

  constructor(
    private batchReportService: BatchReportService,
    private auth: AuthService,
  ) { }

  ngOnInit() { }

  get batches() {
    return this.batchReportService.batches;
  }

  saveBatch(batch: Batch){
    if (batch.id != null) {
      this.selectedBatch = batch;
      this.haveBatch = true;
    }
  }
  searching(value: boolean){
    this.haveBatch = !value;
  }
}
