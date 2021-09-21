import { PermissionService } from './permission.service';
import { Injectable }             from '@angular/core';
import { Router, Resolve,
         ActivatedRouteSnapshot } from '@angular/router';
import { Observable }             from 'rxjs/Observable';


import { DbGroup } from 'app/permission/dbGroup';
import { ErrorHandler } from 'app/shared/errors/error-handler';

@Injectable()
export class PermissionFormResolve implements Resolve<DbGroup> {
  constructor(private service: PermissionService, private router: Router, private errorHandler: ErrorHandler) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> | Promise<any> | any {
    if (!route.params['id']) {
      return this.service.createNewGroup().then(user => {
        return user;
      }).catch((error) => this.errorHandler.fromServer(error));

      // return Promise.resolve(DbGroup.fromData({}));
    }
    let id = route.params['id'];
    return this.service.find(id).then(user => {
      if (user) {
        return user;
      } else {
        this.router.navigate(['/permission']);
        return false;
      }
    }).catch((error) => this.errorHandler.fromServer(error));
  }
}
