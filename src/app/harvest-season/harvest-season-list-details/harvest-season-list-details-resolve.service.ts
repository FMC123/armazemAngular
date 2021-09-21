import { HarvestSeasonService } from '../harvest-season.service';
import { Injectable }             from '@angular/core';
import { Router, Resolve,    ActivatedRouteSnapshot } from '@angular/router';
import { Observable }             from 'rxjs/Observable';
import {HarvestSeason} from '../harvest-season';


@Injectable()
export class HarvestSeasonDetailsResolve implements Resolve<HarvestSeason> {
  constructor(private service: HarvestSeasonService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> | Promise<any> | any {
    if (!route.params['id']) {
      this.router.navigate(['/harvest-season']);
      return false;
    }
    let id = route.params['id'];
    return this.service.find(id).then(harvestSeason => {
      if (harvestSeason) {
        return harvestSeason;
      } else {
        this.router.navigate(['/harvest-season']);
        return false;
      }
    });
  }
}
