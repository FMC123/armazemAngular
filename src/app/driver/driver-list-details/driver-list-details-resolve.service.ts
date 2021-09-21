import { Injectable }             from '@angular/core';
import { Router, Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable }             from 'rxjs/Observable';
import {Driver} from "../driver";
import {DriverService} from "../driver.service";


@Injectable()
export class DriverDetailsResolve implements Resolve<Driver> {
  constructor(
    private service: DriverService,
    private router: Router
  ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> | Promise<any> | any {
    if (!route.params['id']) {
      this.router.navigate(['/driver']);
      return false;
    }
    let id = route.params['id'];
    return this.service.find(id).then(driver => {
      if (driver) {
        return driver;
      } else {
        this.router.navigate(['/driver']);
        return false;
      }
    });
  }
}
