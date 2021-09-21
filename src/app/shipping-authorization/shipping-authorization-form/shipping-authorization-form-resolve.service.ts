import { MarkupGroup } from '../../markup-group/markup-group';
import { Injectable }             from '@angular/core';
import { Router, Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable }             from 'rxjs/Observable';
import { ShippingAuthorizationService } from './../shipping-authorization.service';
import { ShippingAuthorization } from './../shipping-authorization';
import { ErrorHandler } from 'app/shared/errors/error-handler';

@Injectable()
export class ShippingAuthorizationFormResolve implements Resolve<ShippingAuthorization> {
  constructor(private service: ShippingAuthorizationService, private router: Router, private errorHandler: ErrorHandler) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> | Promise<any> | any {
    if (!route.params['id']) {
      let shippingAuthorization = new ShippingAuthorization();
      shippingAuthorization.markupGroup = new MarkupGroup();
      return shippingAuthorization;
    }

    let id = route.params['id'];

    return this.service.find(id).then(shippingAuthorization => {
      if (shippingAuthorization) {
        if (!shippingAuthorization.markupGroup) {
          shippingAuthorization.markupGroup = new MarkupGroup();
        }

        return shippingAuthorization;
      } else {
        this.router.navigate(['/shipping-authorization']);
        return false;
      }
    }).catch((error) => this.errorHandler.fromServer(error));
  }
}
