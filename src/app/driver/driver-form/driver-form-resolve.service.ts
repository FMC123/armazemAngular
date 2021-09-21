import { Injectable }             from '@angular/core';
import { Router, Resolve,
         ActivatedRouteSnapshot } from '@angular/router';
import { Observable }             from 'rxjs/Observable';

import {Driver} from '../driver';
import {DriverService} from "../driver.service";
import {ErrorHandler} from "../../shared/errors/error-handler";

@Injectable()
export class DriverFormResolve implements Resolve<Driver> {
  constructor(
    private service: DriverService,
    private router: Router,
    private errorHandler: ErrorHandler
  ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> | Promise<any> | any {
    if (!route.params['id']) {
      return Promise.resolve(Driver.fromData(new Driver()));
    }
    let id = route.params['id'];
    return this.service.find(id).then(driver => {
      if (driver) {
        return driver;
      } else {
        this.router.navigate(['/driver']);
        return false;
      }
    }).catch((error) => this.errorHandler.fromServer(error));
  }
}
