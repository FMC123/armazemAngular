import { Injectable }             from '@angular/core';
import { Router, Resolve,
         ActivatedRouteSnapshot } from '@angular/router';
import { Observable }             from 'rxjs/Observable';
import {Strainer} from '../strainer';
import {StrainerService} from '../strainer.service';


@Injectable()
export class StrainerDetailsResolve implements Resolve<Strainer> {
  constructor(private service: StrainerService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> | Promise<any> | any {
    if (!route.params['id']) {
      this.router.navigate(['/strainer']);
      return false;
    }
    let id = route.params['id'];
    return this.service.find(id).then(strainer => {
      if (strainer) {
        return strainer;
      } else {
        this.router.navigate(['/strainer']);
        return false;
      }
    });
  }
}
