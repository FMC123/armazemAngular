import { WarehouseStakeholder } from '../warehouse-stakeholder';
import { WarehouseStakeholderService } from '../warehouse-stakeholder.service';

import { Injectable } from '@angular/core';
import { Router, Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { ErrorHandler } from 'app/shared/errors/error-handler';



@Injectable()
export class WarehouseStakeholderDetailsResolve implements Resolve<WarehouseStakeholder> {
  constructor(private service: WarehouseStakeholderService, private router: Router, private errorHandler: ErrorHandler) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> | Promise<any> | any {
    if (!route.params['id']) {
      this.router.navigate(['/warehouse-stakeholder']);
      return false;
    }
    let id = route.params['id'];
     return this.service.find(id).then(warehouseStakeholder => {
        if (warehouseStakeholder) {
          return warehouseStakeholder;
        } else {
          this.router.navigate(['/warehouse-stakeholder']);
          return false;
        }
    }).catch((error) => this.errorHandler.fromServer(error));
  }
}
