import { ServiceGroupItemService } from '../../service-group-items/service-group-item.service';
import { ServiceGroupItemPriceService } from '../service-group-item-price.service';
import { ServiceGroupItemPrice } from '../service-group-item-price';
import { ErrorHandler } from '../../shared/errors/error-handler';
import { ServiceGroupService } from '../../service-group/service-group.service';
import { Injectable }             from '@angular/core';
import { Router, Resolve,
         ActivatedRouteSnapshot } from '@angular/router';
import { Observable }             from 'rxjs/Observable';


@Injectable()
export class ServiceGroupItemPriceFormResolve implements Resolve<ServiceGroupItemPrice> {
   loading: boolean;
   error: boolean;

  constructor(private service: ServiceGroupItemPriceService,
              private serviceGroupItemService: ServiceGroupItemService,
              private errorHandler: ErrorHandler,
              private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> | Promise<any> | any {
    ;
    let serviceGroupItemId = route.queryParams['serviceGroupItemId'];
    let serviceGroupId = route.queryParams['serviceGroupId'];
    let serviceGroupItemPrice = new ServiceGroupItemPrice();
    if (!route.params['id']) {
      return this.serviceGroupItemService.find(serviceGroupId, serviceGroupItemId).then(serviceGroupItem =>{
        serviceGroupItemPrice.serviceGroupItem = serviceGroupItem;
       return serviceGroupItemPrice;
     }).catch((error) => this.handleCriticalError(error));
    }

    let id = route.params['id'];
    return this.service.find(serviceGroupItemId, id).then(serviceGroupItemPrice => {
      if (serviceGroupItemPrice) {
        return serviceGroupItemPrice;
      } else {
        this.router.navigate(['/service-group-item-price']);
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
