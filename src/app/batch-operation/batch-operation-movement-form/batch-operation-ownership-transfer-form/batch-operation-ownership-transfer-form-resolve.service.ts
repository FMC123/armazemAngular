import { Injectable } from '@angular/core';
import { Router, Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { ErrorHandler } from 'app/shared/errors/error-handler';
import { BatchOperationOwnershipTransfer } from './batch-operation-ownership-transfer';

@Injectable()
export class BatchOperationOwnershipTransferFormResolve implements Resolve<BatchOperationOwnershipTransfer> {

  resolve(route: ActivatedRouteSnapshot): Observable<any> | Promise<any> | any {
    return Promise.resolve(BatchOperationOwnershipTransfer.fromData(null));
  }

}
