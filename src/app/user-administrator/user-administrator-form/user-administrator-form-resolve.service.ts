import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { UserAdministratorService } from './../user-administrator.service';
import { User } from './../../user/user';
import { ErrorHandler } from 'app/shared/errors/error-handler';

@Injectable()
export class UserAdministratorFormResolve implements Resolve<User> {
  constructor(private service: UserAdministratorService, private router: Router, private errorHandler: ErrorHandler) { }

  resolve(route: ActivatedRouteSnapshot): Observable<any> | Promise<any> | any {
    if (!route.params['id']) {
      return Promise.resolve(new User());
    }
    let id = route.params['id'];
    return this.service.find(id).then(user => {
      if (user) {
        return user;
      } else {
        this.router.navigate(['/user-administrator']);
        return false;
      }
    }).catch((error) => this.errorHandler.fromServer(error));
  }
}
