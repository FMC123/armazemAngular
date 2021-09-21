import { Component, OnDestroy, OnInit } from '@angular/core';
import { NumberHelper } from 'app/shared/globalization/number-helper';
import { Subscription } from 'rxjs/Rx';

import { ErrorHandler } from '../../../shared/errors/error-handler';
import { Logger } from '../../../shared/logger/logger';
import { ModalManager } from '../../../shared/modals/modal-manager';
import { Notification } from '../../../shared/notification';
import { StorageUnit } from '../../storage-unit';
import { StorageUnitService } from '../../storage-unit.service';
import { BatchStorageUnitService } from '../batch-storage-unit.service';

@Component({
  selector: 'app-batch-storage-unit-list',
  templateUrl: 'batch-storage-unit-list.component.html'
})

export class BatchStorageUnitListComponent implements OnInit, OnDestroy {
  loading: boolean;
  error: boolean;
  deleteConfirm: ModalManager = new ModalManager();

  savedSubscription: Subscription;
  deletedSubscription: Subscription;
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
    private logger: Logger
  ) { }

  ngOnInit() {
    Notification.clearErrors();
    this.loadList();

    this.savedSubscription = this.batchStorageUnitService.saved.subscribe(() => {
      this.loadList();
    });

    this.deletedSubscription = this.batchStorageUnitService.deleted.subscribe(() => {
      this.loadList();
    });
  }

  loadList() {
    this.error = false;
    this.loading = true;
    this.serverService.listByBatch(this.batch.id).then((storageUnits) => {
      this.storageUnits = storageUnits;
      this.storageUnits.map(su => su.batch = this.batch);
      this.storageUnits.sort((a, b) => {
        let aSlash = a.location.indexOf('/') > -1;
        let bSlash = b.location.indexOf('/') > -1;
        if ((aSlash && bSlash) || (!aSlash && !bSlash)) {
          return a.location.localeCompare(b.location);
        } else {
          return aSlash ? 1 : -1;
        }
      });
      this.loading = false;
    }).catch(error => this.handleError(error));
  }

  delete(storageUnit: StorageUnit) {
    this
      .batchStorageUnitService
      .delete(storageUnit)
      .catch(error => this.handleError(error));
  }

  edit(storageUnit: StorageUnit) {
    this.batchStorageUnitService.edit(storageUnit);
  }

  ngOnDestroy() {
    let subscriptions = [
      this.savedSubscription,
      this.deletedSubscription,
    ];

    subscriptions.forEach((subscription: Subscription) => {
      if (subscription && !subscription.closed) {
        subscription.unsubscribe();
      }
    });
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
