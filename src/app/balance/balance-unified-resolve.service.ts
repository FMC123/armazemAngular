import { BalanceService } from './balance.service';
import { Injectable }             from '@angular/core';
import { Router, Resolve,
         ActivatedRouteSnapshot } from '@angular/router';
import { Observable }             from 'rxjs/Observable';
import { ErrorHandler } from 'app/shared/errors/error-handler';

@Injectable()
export class BalanceUnifiedResolve implements Resolve<boolean> {
  constructor(
    private service: BalanceService,
    private router: Router,
    private errorHandler: ErrorHandler,
  ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> | Promise<any> | any {
    return this.service.unifiedWithLobby().catch((e) => this.errorHandler.fromServer(e));
  }
}
