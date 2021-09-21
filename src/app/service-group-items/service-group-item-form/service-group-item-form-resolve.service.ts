import { ErrorHandler } from '../../shared/errors/error-handler';
import { ServiceGroupService } from '../../service-group/service-group.service';
import { ServiceGroupItemService } from '../service-group-item.service';
import { ServiceGroupItem } from '../service-group-item';
import { Injectable }             from '@angular/core';
import { Router, Resolve,
         ActivatedRouteSnapshot } from '@angular/router';
import { Observable }             from 'rxjs/Observable';


@Injectable()
export class ServiceGroupItemFormResolve implements Resolve<ServiceGroupItem> {
   loading: boolean;
   error: boolean;

  constructor(private service: ServiceGroupItemService, 
              private serviceGroupService: ServiceGroupService,
              private errorHandler: ErrorHandler,
              private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> | Promise<any> | any {
    let serviceGroupId = route.queryParams['serviceGroupId'];
    let serviceGroupItem = new ServiceGroupItem();
    if (!route.params['id']) {
      return this.serviceGroupService.find(serviceGroupId).then(serviceGroup =>{
        serviceGroupItem.serviceGroup = serviceGroup;
       return serviceGroupItem;
     }).catch((error) => this.handleCriticalError(error));
    }

    let id = route.params['id'];
    return this.service.find(serviceGroupId, id).then(serviceGroupItem => {
      if (serviceGroupItem) {
        return serviceGroupItem;
      } else {
        this.router.navigate(['/service-group-item']);
        return false;
      }
    });
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
