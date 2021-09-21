import { Component, OnDestroy, OnInit } from '@angular/core';
import { NumberHelper } from 'app/shared/globalization/number-helper';

import { ErrorHandler } from '../../../shared/errors/error-handler';
import { Notification } from '../../../shared/notification';
import { StorageUnit } from '../../storage-unit';
import { StorageUnitService } from '../../storage-unit.service';
import { BatchStorageUnitService } from '../batch-storage-unit.service';

@Component({
  selector: 'app-batch-storage-unit-history-list',
  templateUrl: 'batch-storage-unit-history-list.component.html'
})

export class BatchStorageUnitHistoryListComponent implements OnInit, OnDestroy {
  loading: boolean;
  error: boolean;
  storageUnits: Array<StorageUnit> = [];

  get batch() {
    return this.batchStorageUnitService.batch;
  }

  get batchOperation() {
    return this.batchStorageUnitService.batchOperation;
  }

  constructor(
    private serverService: StorageUnitService,
    private batchStorageUnitService: BatchStorageUnitService,
    private errorHandler: ErrorHandler,
  ) { }

  ngOnInit() {
    Notification.clearErrors();
    this.loadList();
  }

  loadList() {
    this.error = false;
    this.loading = true;
    this.serverService.listHistoryByBatch(this.batch.id).then((storageUnits) => {
      this.storageUnits = storageUnits;
      this.storageUnits.map(su => su.batch = this.batch)
      this.loading = false;
    }).catch(error => this.handleError(error));
  }

  ngOnDestroy() {

  }

  get totalQuantity() {
    return this.storageUnits.map(su => su.quantity).reduce((a, b) => a + b, 0);
  }

  get totalQuantityString() {
    return NumberHelper.toPTBR(this.totalQuantity);
  }

  get averageWeight() {
    let averageWeightSack = NumberHelper.toPTBR(this.batch.averageWeightSack);
    return (averageWeightSack) ? averageWeightSack + ' Kgs' : '';
  }

  handleError(error) {
    this.error = true;
    this.loading = false;
    return this.errorHandler.fromServer(error);
  }
}
