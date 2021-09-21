import { Injectable }             from '@angular/core';
import { Router, Resolve,
         ActivatedRouteSnapshot } from '@angular/router';
import { Observable }             from 'rxjs/Observable';
import {Forklift} from '../forklift';
import {ForkliftService} from '../forklift.service';
import {ForkliftDetailsComponent} from './forklift-list-details.component';


@Injectable()
export class ForkliftDetailsResolve implements Resolve<Forklift> {
  constructor(private service: ForkliftService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> | Promise<any> | any {
    if (!route.params['id']) {
      this.router.navigate(['/forklift']);
      return false;
    }
    let id = route.params['id'];
    return this.service.find(id).then(forklift => {
      if (forklift) {
        return forklift;
      } else {
        this.router.navigate(['/forklift']);
        return false;
      }
    });
  }
}
