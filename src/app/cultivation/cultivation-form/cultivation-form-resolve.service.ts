import { CultivationService } from '../cultivation.service';
import { Injectable }             from '@angular/core';
import { Router, Resolve,ActivatedRouteSnapshot } from '@angular/router';
import { Observable }             from 'rxjs/Observable';

import {Cultivation} from '../cultivation';

@Injectable()
export class CultivationFormResolve implements Resolve<Cultivation> {
  constructor(
    private service: CultivationService,
    private router: Router
  ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> | Promise<any> | any {
    if (!route.params['id']) {
      return Promise.resolve(new Cultivation());
    }

    let id = route.params['id'];
    return this.service.find(id).then(cultivation => {
      if (cultivation) {
        return cultivation;
      } else {
        this.router.navigate(['/cultivation']);
        return false;
      }
    });
  }
}
