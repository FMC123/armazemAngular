import { ServiceGroupItem } from '../service-group-item';
import { ServiceGroupItemService } from '../service-group-item.service';
import { Injectable }             from '@angular/core';
import { Router, Resolve,
         ActivatedRouteSnapshot } from '@angular/router';
import { Observable }             from 'rxjs/Observable';


@Injectable()
export class ServiceGroupItemDetailsResolve implements Resolve<ServiceGroupItem> {
  constructor(private service: ServiceGroupItemService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> | Promise<any> | any {
    if (!route.params['id']) {
      this.router.navigate(['/service-group-item']);
      return false;
    }
    let id = route.params['id'];
    let serviceGroupId  = route.params['serviceGroupId'];
    return this.service.find(serviceGroupId, id).then(serviceGroupItem => {
      if (serviceGroupItem) {
        return serviceGroupItem;
      } else {
        this.router.navigate(['/service-group-item']);
        return false;
      }
    });
  }
}
