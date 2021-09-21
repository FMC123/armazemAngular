import { PurchaseProspect } from './../purchase-prospect';
import { PurchaseProspectService } from './../purchase-prospect.service';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { ErrorHandler } from 'app/shared/errors/error-handler';

@Injectable()
export class PurchaseProspectDetailsResolve implements Resolve<PurchaseProspect> {
  constructor(private service: PurchaseProspectService, private router: Router, private errorHandler: ErrorHandler) { }

  resolve(route: ActivatedRouteSnapshot): Observable<any> | Promise<any> | any {
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
