import { Injectable }             from '@angular/core';
import { Router, Resolve,
  ActivatedRouteSnapshot } from '@angular/router';
import { Observable }             from 'rxjs/Observable';

import {AuthService} from "../../auth/auth.service";
import {StackService} from "../stack.service";
import {Stack} from "../stack";
import { ErrorHandler } from 'app/shared/errors/error-handler';


@Injectable()
export class StackDetailsResolve implements Resolve<Stack> {
  constructor(private auth: AuthService,private service: StackService, private router: Router, private errorHandler: ErrorHandler) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> | Promise<any> | any {
    if (!route.params['id']) {
      this.router.navigate(['/position-layer']);
      return false;
    }
    let id = route.params['id'];
    return this.service.find(id).then(stack => {
      if (stack) {
        return stack;
      } else {
        this.router.navigate(['/position-layer']);
        return false;
      }
    }).catch((error) => this.errorHandler.fromServer(error));
  }
}
