import { BatchOperationService } from '../../../batch-operation/batch-operation.service';
import { BatchOperation } from '../../../batch-operation/batch-operation';
import { Transportation } from '../../../transportation/transportation';
import { BalanceService } from '../../balance.service';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { BalanceTransportationInService } from '../balance-transportation-in.service';

@Component({
  selector: 'app-balance-transportation-batch-weighing-share',
  templateUrl: 'balance-transportation-batch-weighing-share.component.html',
  providers: [BalanceTransportationInService],
})

export class BalanceTransportationBatchWeighingShareComponent implements OnInit {
  loading: boolean;
  batchOperation: BatchOperation;
  transportation: Transportation;

  constructor(
    private route: ActivatedRoute,
    private batchOperationService: BatchOperationService,
    private balanceService: BalanceService,
    private balanceTransportationService: BalanceTransportationInService
  ) { }

  ngOnInit() {
    this.route.data.forEach((data: { batchOperation: BatchOperation, transportation: Transportation }) => {
      this.batchOperation = BatchOperation.fromData(data.batchOperation);
      this.transportation = Transportation.fromData(data.transportation);
    });

    this.loading = true;
  }

  refreshBatchOperation() {
    this.batchOperationService.find(this.batchOperation.id).then((batchOperation) => {
      this.batchOperation = batchOperation;
    });
  }

  fiscalNotesOf(batchOperation: BatchOperation) {
    return this.balanceTransportationService.fiscalNotesOf(batchOperation).map(fiscalNote => fiscalNote.code).join(', ');
  }
}

