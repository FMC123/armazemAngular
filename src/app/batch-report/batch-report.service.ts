import { Notification } from '../shared/notification';
import { ErrorHandler } from '../shared/errors/error-handler';
import { BatchService } from '../batch/batch.service';
import { Batch } from '../batch/batch';
import { Injectable } from '@angular/core';

@Injectable()
export class BatchReportService {
  batches: Array<Batch>;
  loading = false;

  constructor(
    private batchService: BatchService,
    private errorHandler: ErrorHandler
  ) {}

  search(code: string, ref: string) {
    this.loading = true;
    this.batches = null;

    return this.batchService.findByCodeOrRefClient(code, ref).then((batchesRes) => {
      this.batches = batchesRes;
      this.loading = false;

      if (!this.batches) {
        Notification.error(`Lote ${code}/${ref} não encontrado!`);
      }
    }).catch(error => {
      this.errorHandler.fromServer(error);
      this.loading = false;
    });
  }

}
