import { Observable } from 'rxjs/Rx';
import { ActivatedRouteSnapshot } from '@angular/router';
import { ErrorHandler } from '../../shared/errors/error-handler';
import { BatchPositionService } from './batch-position.service';
import { Resolve } from '@angular/router/src/interfaces';
import { Injectable } from '@angular/core';
import { BatchPosition } from './batch-position';

@Injectable()
export class BatchPositionResolve implements Resolve<Array<BatchPosition>> {
  constructor(
    private service: BatchPositionService,
    private errorHandler: ErrorHandler,
  ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> | Promise<any> | any {
    return this.service.listActual().catch(error => this.errorHandler.fromServer(error));
  }
}
