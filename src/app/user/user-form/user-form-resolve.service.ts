import { Injectable }             from '@angular/core';
import { Router, Resolve,
         ActivatedRouteSnapshot } from '@angular/router';
import { Observable }             from 'rxjs/Observable';

import { UserService } from '../user.service';
import { User } from '../user';
import { ErrorHandler } from 'app/shared/errors/error-handler';

@Injectable()
export class UserFormResolve implements Resolve<User> {
  constructor(
    private service: UserService,
    private router: Router,
    private errorHandler: ErrorHandler
  ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> | Promise<any> | any {
    if (!route.params['id']) {
      return Promise.resolve(User.fromData(new User()));
    }
    let id = route.params['id'];
    return this.service.find(id).then(user => {
      if (user) {
        return user;
      } else {
        this.router.navigate(['/user']);
        return false;
      }
    }).catch((error) => this.errorHandler.fromServer(error));
  }
}
