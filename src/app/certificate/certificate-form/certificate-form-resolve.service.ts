import { Injectable }             from '@angular/core';
import { Router, Resolve,
         ActivatedRouteSnapshot } from '@angular/router';
import { Observable }             from 'rxjs/Observable';

import { Certificate } from './../certificate';
import { CertificateService } from './../certificate.service';
import { ErrorHandler } from 'app/shared/errors/error-handler';

@Injectable()
export class CertificateFormResolve implements Resolve<Certificate> {
  constructor(private service: CertificateService, private router: Router, private errorHandler: ErrorHandler) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> | Promise<any> | any {
    if (!route.params['id']) {
      return Promise.resolve(Certificate.fromData({}));
    }
    let id = route.params['id'];
    return this.service.find(id).then(certificate => {
      if (certificate) {
        return certificate;
      } else {
        this.router.navigate(['/certificate']);
        return false;
      }
    }).catch((error) => this.errorHandler.fromServer(error));
  }
}
