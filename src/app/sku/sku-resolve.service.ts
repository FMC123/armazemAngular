import {SkuService} from './sku.service';
import {Injectable} from '@angular/core';
import {Router, Resolve, ActivatedRouteSnapshot} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {Sku} from './sku';
import {ErrorHandler} from 'app/shared/errors/error-handler';

@Injectable()
export class SkuResolve implements Resolve<Sku> {
  constructor(private service: SkuService,
              private router: Router,
              private errorHandler: ErrorHandler) {
  }

  resolve(route: ActivatedRouteSnapshot): Observable<any> | Promise<any> | any {
    if (!route.params['id']) {
      return Promise.resolve(new Sku());
    }
    let id = route.params['id'];
    return this.service.find(id).then(sku => {
      if (sku) {
        return sku;
      } else {
        this.router.navigate(['/sku']);
        return false;
      }
    }).catch((error) => this.errorHandler.fromServer(error));
  }
}
