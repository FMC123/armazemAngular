import { ErrorHandler } from '../shared/errors/error-handler';
import { Autocomplete } from '../shared/forms/autocomplete/autocomplete';
import { Observable } from 'rxjs/Rx';
import { Person } from '../person/person';
import {Injectable, Input} from '@angular/core';
import { BatchService } from 'app/batch/batch.service';
import {WarehouseStakeholder} from "../warehouse-stakeholder/warehouse-stakeholder";

export class BatchAutocomplete extends Autocomplete {

  constructor(
    private batchService: BatchService,
    private errorHandler: ErrorHandler
  ) {
    super('batchCode', 10);
  }

  load(search: string) {
    if(this.batchService.ownerId && this.batchService.ownerId != '')
    {
      return Observable.fromPromise(this.batchService.searchByOwner(search, this.batchService.ownerId)
        .catch((error) => {
          this.errorHandler.fromServer(error);
          this.value = null;
        }));
    }
    return Observable.fromPromise(this.batchService.search(search)
      .catch((error) => {
        this.errorHandler.fromServer(error);
        this.value = null;
      }));
  }
}
