import { ServiceItemService } from '../service-item.service';
import { ServiceItem } from '../service-item';
import { Injectable }             from '@angular/core';
import { Router, Resolve,
         ActivatedRouteSnapshot } from '@angular/router';
import { Observable }             from 'rxjs/Observable';

@Injectable()
export class ItemDetailsResolve implements Resolve<ServiceItem> {
  constructor(private service: ServiceItemService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> | Promise<any> | any {
    if (!route.params['id']) {
      this.router.navigate(['/service-item']);
      return false;
    }
    let id = route.params['id'];
    return this.service.find(id).then(item => {
      if (item) {
        return item;
      } else {
        this.router.navigate(['/service-item']);
        return false;
      }
    });
  }
}
