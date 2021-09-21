import { ServiceGroupService } from '../service-group.service';
import { ServiceGroup } from '../service-group';
import { Injectable }             from '@angular/core';
import { Router, Resolve,
         ActivatedRouteSnapshot } from '@angular/router';
import { Observable }             from 'rxjs/Observable';
import { ErrorHandler } from 'app/shared/errors/error-handler';


@Injectable()
export class ServiceGroupDetailsResolve implements Resolve<ServiceGroup> {
  constructor(private service: ServiceGroupService, private router: Router, private errorHandler: ErrorHandler) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> | Promise<any> | any {
    if (!route.params['id']) {
      this.router.navigate(['/service-group']);
      return false;
    }
    let id = route.params['id'];
    return this.service.find(id).then(serviceGroup => {
      if (serviceGroup) {
        return serviceGroup;
      } else {
        this.router.navigate(['/service-group']);
        return false;
      }
    }).catch((error) => this.errorHandler.fromServer(error));
  }
}
