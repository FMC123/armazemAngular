import {ErrorHandler} from '../shared/errors/error-handler';
import {Autocomplete} from '../shared/forms/autocomplete/autocomplete';
import {Observable} from 'rxjs/Rx';
import {Person} from '../person/person';
import {Injectable} from '@angular/core';
import {BatchService} from 'app/batch/batch.service';
import {Batch} from "./batch";
import {BatchOperation} from "../batch-operation/batch-operation";
import {WarehouseStakeholder} from "../warehouse-stakeholder/warehouse-stakeholder";

export class BatchFilterAutocomplete extends Autocomplete {

  public ownerId: string;
  public warehouseId: string;

  constructor(
    private batchService: BatchService,
    private errorHandler: ErrorHandler,
  ) {
    super('batchCode', 10);
  }

  load(search: string) {
    const batch = new Batch();
    batch.batchCode = search;
    if (this.ownerId) {
      batch.batchOperation = new BatchOperation();
      batch.batchOperation.owner = new WarehouseStakeholder();
      batch.batchOperation.owner.id = this.ownerId;
    }
    if (this.warehouseId) {
      batch.warehouse.id = this.warehouseId;
    }
    return Observable.fromPromise(this.batchService.listFilter(batch, true).catch((error) => this.errorHandler.fromServer(error)));
  }
}
