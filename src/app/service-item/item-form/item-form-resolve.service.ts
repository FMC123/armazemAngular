import { Injectable }             from '@angular/core';
import { Router, Resolve,
         ActivatedRouteSnapshot } from '@angular/router';
import { Observable }             from 'rxjs/Observable';

import {ServiceItem} from '../service-item';
import {ServiceItemService} from "../service-item.service";

@Injectable()
export class ItemFormResolve implements Resolve<ServiceItem> {
  constructor(private service: ServiceItemService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> | Promise<any> | any {
    if (!route.params['id']) {
      return Promise.resolve(new ServiceItem);
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
