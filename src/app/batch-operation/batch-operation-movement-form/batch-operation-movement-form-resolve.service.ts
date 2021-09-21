import { Injectable } from '@angular/core';
import { Router, Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { ErrorHandler } from 'app/shared/errors/error-handler';
import { BatchOperationMovement } from './batch-operation-movement';

@Injectable()
export class BatchOperationMovementFormResolve implements Resolve<BatchOperationMovement> {

  resolve(route: ActivatedRouteSnapshot): Observable<any> | Promise<any> | any {
    return Promise.resolve(BatchOperationMovement.fromData());
  }
  
}
