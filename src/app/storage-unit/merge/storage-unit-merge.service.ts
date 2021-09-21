import { Notification } from '../../shared/notification';
import { Injectable } from '@angular/core';
import { Batch } from 'app/batch/batch';
import { BatchService } from 'app/batch/batch.service';
import { ErrorHandler } from 'app/shared/errors/error-handler';

@Injectable()
export class StorageUnitMergeService {
  batches: Array<Batch>;
  batch: Batch;
  loading = false;

  constructor(
    private batchService: BatchService,
    private errorHandler: ErrorHandler
  ) {}

  search(code: string) {
    this.loading = true;
    this.batches = null;

    return this.batchService.findByCode(code).then((batches) => {
      this.batches = batches;
      this.loading = false;

      if (!this.batches) {
        Notification.error(`Lote ${code} não encontrado!`);
      }

      this.batch = this.batches[0];
    }).catch(error => {
      this.errorHandler.fromServer(error);
      this.loading = false;
    });
  }

}
