import { Observable } from 'rxjs/Rx';
import { BatchService } from '../../batch/batch.service';
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';
import { Batch } from '../../batch/batch';
import { Injectable } from '@angular/core';
import { ErrorHandler } from 'app/shared/errors/error-handler';

@Injectable()
export class BatchStorageUnitResolve implements Resolve<Batch> {

  constructor(
    private service: BatchService,
    private router: Router,
    private errorHandler: ErrorHandler
  ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> | Promise<any> | any {
    let batchOperationId = route.params['batchOperationId'];
    let batchId = route.params['batchId'];

    if (!batchId) {
      this.router.navigate(['/batch-operation', batchOperationId, 'edit']);
      return null;
    }

    return this.service.find(batchOperationId, batchId).then((batch: Batch) => {
      if (batch) {
        return batch;
      } else {
        this.router.navigate(['/batch-operation', batchOperationId, 'edit']);
        return null;
      }
    }).catch((error) => this.errorHandler.fromServer(error));
  }
}
