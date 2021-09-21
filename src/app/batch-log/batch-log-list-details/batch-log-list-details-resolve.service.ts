import { Injectable }             from '@angular/core';
import { Router, Resolve,
         ActivatedRouteSnapshot } from '@angular/router';
import { Observable }             from 'rxjs/Observable';
import {BatchLog} from '../batch-log';
import {BatchLogService} from '../batch-log.service';
import { ErrorHandler } from 'app/shared/errors/error-handler';

@Injectable()
export class BatchLogDetailsResolve implements Resolve<BatchLog> {
  constructor(private service: BatchLogService, private router: Router, private errorHandler: ErrorHandler) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> | Promise<any> | any {
    if (!route.params['id']) {
      this.router.navigate(['/batch-log']);
      return false;
    }
    let id = route.params['id'];
    return this.service.find(id).then(batchLog => {
      if (batchLog) {
        return batchLog;
      } else {
        this.router.navigate(['/batch-log']);
        return false;
      }
    }).catch((error) => this.errorHandler.fromServer(error));
  }
}
