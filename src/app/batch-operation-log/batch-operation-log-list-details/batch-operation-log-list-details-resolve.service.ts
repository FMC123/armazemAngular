import { Injectable }             from '@angular/core';
import { Router, Resolve,
         ActivatedRouteSnapshot } from '@angular/router';
import { Observable }             from 'rxjs/Observable';
import {BatchOperationLog} from '../batch-operation-log';
import {BatchOperationLogService} from '../batch-operation-log.service';


@Injectable()
export class BatchOperationLogDetailsResolve implements Resolve<BatchOperationLog> {
  constructor(private service: BatchOperationLogService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> | Promise<any> | any {
    if (!route.params['id']) {
      this.router.navigate(['/batch-operation-log']);
      return false;
    }

    let id = route.params['id'];
    return this.service.find(id).then(batchOperationLog => {
      if (batchOperationLog) {
        return batchOperationLog;
      } else {
        this.router.navigate(['/batch-operation-log']);
        return false;
      }
    });
  }
}
