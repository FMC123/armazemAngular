import { Injectable }             from '@angular/core';
import { Router, Resolve,
         ActivatedRouteSnapshot } from '@angular/router';
import { Observable }             from 'rxjs/Observable';

import { WarehouseService } from './../warehouse.service';
import { Warehouse } from './../warehouse';
import { ErrorHandler } from 'app/shared/shared.module';

@Injectable()
export class WarehouseFormResolve implements Resolve<Warehouse> {
  constructor(private service: WarehouseService, private router: Router, private errorHandler: ErrorHandler) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> | Promise<any> | any {
    if (!route.params['id']) {
      return Promise.resolve(Warehouse.fromData({}));
    }
    let id = route.params['id'];
    return this.service.find(id).then(warehouse => {
      if (warehouse) {
        return warehouse;
      } else {
        this.router.navigate(['/warehouse']);
        return false;
      }
    }).catch((error) => this.errorHandler.fromServer(error));
  }
}
