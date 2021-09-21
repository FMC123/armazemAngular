import { Injectable } from '@angular/core';
import { Router, Resolve,
  ActivatedRouteSnapshot } from '@angular/router';
import { Observable }             from 'rxjs/Observable';

import { ForkliftService } from '../forklift.service';
import {Forklift} from "../forklift";

@Injectable()
export class ForkliftFormResolve implements Resolve<Forklift> {

  constructor(private service: ForkliftService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> | Promise<any> | any {
    if (!route.params['id']) {
      return Promise.resolve(new Forklift);
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
