import { Observable } from 'rxjs/Rx';
import { PackStockService } from '../pack-stock.service';
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';
import { PackStockMovementGroup } from '../pack-stock-movement-group';
import { Injectable } from '@angular/core';
import { ErrorHandler } from 'app/shared/errors/error-handler';

@Injectable()
export class PackStockFormResolve implements Resolve<PackStockMovementGroup> {

  constructor(private service: PackStockService, private router: Router, private errorHandler: ErrorHandler) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> | Promise<any> | any {
    if (!route.params['id']) {
      let group = new PackStockMovementGroup();
      group.indStockOut = route.queryParams['type'] === 'OUT';
      return Promise.resolve(group);
    }

    let id = route.params['id'];
    return this.service.find(id).then(group => {
      if (group) {
        return group;
      } else {
        this.router.navigate(['/pack-stock']);
        return false;
      }
    }).catch((error) => this.errorHandler.fromServer(error));
  }


}
