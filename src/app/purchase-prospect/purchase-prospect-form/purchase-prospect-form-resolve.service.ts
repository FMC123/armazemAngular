import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { PurchaseProspectService } from './../purchase-prospect.service';
import { PurchaseProspect } from './../purchase-prospect';
import { ErrorHandler } from 'app/shared/errors/error-handler';

@Injectable()
export class PurchaseProspectFormResolve implements Resolve<PurchaseProspect> {
  constructor(
    private service: PurchaseProspectService,
    private router: Router, private errorHandler: ErrorHandler) {
  }

  resolve(route: ActivatedRouteSnapshot): Observable<any> | Promise<any> | any {
    if (!route.params['id']) {
      return Promise.resolve(new PurchaseProspect());
      //return Promise.resolve(PurchaseProspect.fromData());
    }

    let id = route.params['id'];

    return this.service.find(id).then(purchaseProspect => {
      if (purchaseProspect) {
        return purchaseProspect;
      } else {
        this.router.navigate(['/purchase-prospect']);
        return false;
      }
    }).catch((error) => this.errorHandler.fromServer(error));
  }
}
