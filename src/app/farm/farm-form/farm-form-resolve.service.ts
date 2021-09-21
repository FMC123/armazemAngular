import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { Farm } from '../farm';
import { FarmService } from '../farm.service';

  @Injectable()
  export class FarmFormResolve implements Resolve<Farm> {
    constructor(
      private service: FarmService,
      private router: Router,
    ) {}

    resolve(route: ActivatedRouteSnapshot): Observable<any> | Promise<any> | any {

      if (!route.params['id']) {
        return Promise.resolve(new Farm());
      }

      let farm = new Farm();
      return this.service.find(route.params['id']).then(farm => {
        if (farm) {
          return farm;
        } else {
          this.router.navigate(['/farm']);
          return false;
        }
      });
    }
  }
