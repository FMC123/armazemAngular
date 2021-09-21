import { Resolve } from '@angular/router/src/interfaces';
import { BatchOperation } from '../../../batch-operation/batch-operation';
import { Observable } from 'rxjs/Rx';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { BatchOperationService } from '../../../batch-operation/batch-operation.service';
import { Injectable } from '@angular/core';
import { ErrorHandler } from 'app/shared/errors/error-handler';

@Injectable()
export class BatchWeighingResolve implements Resolve<BatchOperation> {
  constructor(
    private service: BatchOperationService,
    private router: Router,
    private errorHandler: ErrorHandler,
  ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> | Promise<any> | any {
    let id = route.params['id'];

    if (!id) {
      this.router.navigate(['/balance']);
      return;
    }

    return this.service.find(id).then((batchOperation: BatchOperation) => {
      if (batchOperation) {
        return batchOperation;
      } else {
        this.router.navigate(['/balance']);
        return null;
      }
    })
    .catch((error) => this.errorHandler.fromServer(error));
  }
}
