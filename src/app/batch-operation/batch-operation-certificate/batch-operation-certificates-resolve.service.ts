import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { BatchOperationCertificate } from './batch-operation-certificate';
import { BatchOperationCertificateService } from './batch-operation-certificate.service';
import { AuthService } from 'app/auth/auth.service';
import { ErrorHandler } from 'app/shared/errors/error-handler';

@Injectable()
export class BatchOperationCertificatesResolve implements Resolve<Array<BatchOperationCertificate>> {
  constructor(
    private auth: AuthService,
    private service: BatchOperationCertificateService,
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
