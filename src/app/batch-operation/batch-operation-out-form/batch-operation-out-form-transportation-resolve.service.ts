import { Transportation } from '../../transportation/transportation';
import { TransportationService } from '../../transportation/transportation.service';
import { Resolve } from '@angular/router/src/interfaces';
import { BatchOperation } from '../batch-operation';
import { Observable } from 'rxjs/Rx';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { ErrorHandler } from 'app/shared/errors/error-handler';

@Injectable()
export class BatchOperationOutFormTransportationResolve implements Resolve<BatchOperation> {
  constructor(
    private transportationService: TransportationService,
    private router: Router,
    private errorHandler: ErrorHandler,
  ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> | Promise<any> | any {
    let id = route.params['id'];

    if (!id) {
      this.router.navigate(['/batch-operation']);
      return;
    }

    return this.transportationService
      .findByBatchOperation(id)
      .then((transportation: Transportation) => {
        if (transportation) {
          return transportation;
        } else {
          this.router.navigate(['/batch-operation']);
          return null;
        }
      })
      .catch((error) => this.errorHandler.fromServer(error));
  }
}
