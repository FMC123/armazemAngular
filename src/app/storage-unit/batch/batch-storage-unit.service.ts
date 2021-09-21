import { EventEmitter } from '@angular/common/src/facade/async';
import { StorageUnit } from '../storage-unit';
import { StorageUnitService } from '../storage-unit.service';
import { Batch } from '../../batch/batch';
import { BatchOperation } from '../../batch-operation/batch-operation';
import { Injectable } from '@angular/core';

@Injectable()
export class BatchStorageUnitService {

  batch: Batch;
  saved = new EventEmitter<StorageUnit>(false);
  deleted = new EventEmitter<StorageUnit>(false);
  edited = new EventEmitter<StorageUnit>(false);

  constructor(
    private serverService: StorageUnitService,
  ) {}

  get batchOperation() {
    if (!this.batch) {
      return null;
    }

    return this.batch.batchOperation;
  }

  edit(storageUnit: StorageUnit) {
    this.edited.emit(storageUnit);
  }

  save(storageUnit: StorageUnit) {
    return this.serverService.save(storageUnit).then(() => {
      this.saved.emit(storageUnit);
    });
  }

  delete(storageUnit: StorageUnit) {
    return this.serverService.delete(storageUnit.id).then(() => {
      this.deleted.emit(storageUnit);
    });
  }

}
