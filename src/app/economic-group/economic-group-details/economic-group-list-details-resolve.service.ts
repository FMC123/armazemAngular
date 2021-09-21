import { Injectable }             from '@angular/core';
import { Router, Resolve,
         ActivatedRouteSnapshot } from '@angular/router';
import { Observable }             from 'rxjs/Observable';
import {EconomicGroup} from '../economic-group';
import {EconomicGroupService} from '../economic-group.service';


@Injectable()
export class EconomicGroupDetailsResolve implements Resolve<EconomicGroup> {
  constructor(private service: EconomicGroupService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> | Promise<any> | any {
    if (!route.params['id']) {
      this.router.navigate(['/economic-group']);
      return false;
    }
    let id = route.params['id'];
    return this.service.find(id).then(economicGroup => {
      if (economicGroup) {
        return economicGroup;
      } else {
        this.router.navigate(['/economic-group']);
        return false;
      }
    });
  }
}
