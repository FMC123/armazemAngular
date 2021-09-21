import { ServiceRequest } from './../service-request';
import { ServiceRequestService } from './../service-request.service';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { ErrorHandler } from 'app/shared/errors/error-handler';

@Injectable()
export class ServiceRequestDetailsResolve implements Resolve<ServiceRequest> {
  constructor(private service: ServiceRequestService, private router: Router, private errorHandler: ErrorHandler) { }

  resolve(route: ActivatedRouteSnapshot): Observable<any> | Promise<any> | any {
    let id = route.params['id'];
    return this.service.find(id).then(serviceRequest => {
      if (serviceRequest) {
        return serviceRequest;
      } else {
        this.router.navigate(['/service-request']);
        return false;
      }
    }).catch((error) => this.errorHandler.fromServer(error));
  }
}
