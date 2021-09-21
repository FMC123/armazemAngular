import { Injectable }             from '@angular/core';
import { Router, Resolve,
         ActivatedRouteSnapshot } from '@angular/router';
import { Observable }             from 'rxjs/Observable';

import { ErrorHandler } from './../../shared/errors/error-handler';
import {AuthService} from "../../auth/auth.service";
import {Stack} from "../stack";
import {StackService} from "../stack.service";
import {PositionService} from "../../position/position.service";
@Injectable()
export class StackFormResolve implements Resolve<Position> {
  loading: boolean;
  error: boolean;

  constructor(private auth: AuthService,
    private service: StackService,
              private positionService: PositionService,
              private errorHandler: ErrorHandler,
              private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> | Promise<any> | any {
    let id = route.params['id'];
    let positionId = route.queryParams['positionId'];
    let stack = new Stack();
    if (!route.params['id']) {
      return this.positionService.find(this.auth.accessToken.warehouse.id,positionId).then(position => {
        stack.position = position;

       return stack;
     }).catch((error) => this.handleCriticalError(error));
    }

      return this.service.find(id).then(stack => {
        if (stack) {
            return stack;
          } else {
            this.router.navigate(['/stack-list/'+positionId]);
            return false;
          }

    }).catch((error) => this.handleCriticalError(error));
  }

  private handleCriticalError(error) {
    this.handleError(error).catch(() => {
      this.router.navigate(['/error']);
    });
  }

  private handleError(error) {
    this.loading = false;
    return this.errorHandler.fromServer(error);
  }
}
