import { AuthService } from '../auth/auth.service';
import { MarkupGroup } from './markup-group';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { MarkupGroupService } from './markup-group.service';
import { ErrorHandler } from 'app/shared/errors/error-handler';

@Injectable()
export class MarkupGroupsResolve implements Resolve<Array<MarkupGroup>> {
  constructor(
    private auth: AuthService,
    private service: MarkupGroupService,
    private router: Router,
    private errorHandler: ErrorHandler,
  ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> | Promise<any> | any {
    return this.service
      .sync(this.auth.accessToken.warehouse.id, null)
      .then(list => {
        return list || [];
      })
      .catch((error) => this.errorHandler.fromServer(error));
  }
}
