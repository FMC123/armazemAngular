import { ShippingAuthorization } from './../shipping-authorization';
import { ShippingAuthorizationService } from './../shipping-authorization.service';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { ErrorHandler } from 'app/shared/errors/error-handler';

@Injectable()
export class ShippingAuthorizationDetailsResolve implements Resolve<ShippingAuthorization> {
  constructor(private service: ShippingAuthorizationService, private router: Router, private errorHandler: ErrorHandler) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> | Promise<any> | any {
    let id = route.params['id'];

    return this.service.find(id).then(shippingAuthorization => {
      if (shippingAuthorization) {
        return shippingAuthorization;
      } else {
        this.router.navigate(['/shipping-authorization']);
        return false;
      }
    }).catch((error) => this.errorHandler.fromServer(error));
  }
}
