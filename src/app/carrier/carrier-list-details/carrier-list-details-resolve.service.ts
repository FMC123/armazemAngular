import { Injectable }             from '@angular/core';
import { Router, Resolve,
         ActivatedRouteSnapshot } from '@angular/router';
import { Observable }             from 'rxjs/Observable';
import {Carrier} from "../carrier";
import {CarrierService} from "../carrier.service";


@Injectable()
export class CarrierDetailsResolve implements Resolve<Carrier> {
  constructor(private service: CarrierService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> | Promise<any> | any {
    if (!route.params['id']) {
      this.router.navigate(['/carrier']);
      return false;
    }
    let id = route.params['id'];
    return this.service.find(id).then(carrier => {
      if (carrier) {
        return carrier;
      } else {
        this.router.navigate(['/carrier']);
        return false;
      }
    });
  }
}
