import { PackStockService } from '../pack-stock.service';
import { PackStockMovementGroup } from '../pack-stock-movement-group';
import { Injectable }             from '@angular/core';
import { Router, Resolve,
         ActivatedRouteSnapshot } from '@angular/router';
import { Observable }             from 'rxjs/Observable';
import { ErrorHandler } from 'app/shared/errors/error-handler';

@Injectable()
export class PackStockDetailsResolve implements Resolve<PackStockMovementGroup> {
  constructor(private service: PackStockService, private router: Router, private errorHandler: ErrorHandler) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> | Promise<any> | any {
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
