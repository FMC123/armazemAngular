import { Injectable }             from '@angular/core';
import { Router, Resolve,
         ActivatedRouteSnapshot } from '@angular/router';
import { Observable }             from 'rxjs/Observable';
import { WarehouseStakeholder } from '../../warehouse-stakeholder/warehouse-stakeholder';
import { WarehouseStakeholderService } from '../../warehouse-stakeholder/warehouse-stakeholder.service';
import { Farm } from '../farm';
import { FarmService } from '../farm.service';


@Injectable()
export class FarmDetailsResolve implements Resolve<Farm> {
  constructor(private service: FarmService,
              private warehouseStakeholderService: WarehouseStakeholderService,
               private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> | Promise<any> | any {

    let id = route.params['id'];
    let warehouseStakeholder = route.params['warehouseStakeholder'];

  return this.service.find(warehouseStakeholder, id).then(farm => {
      if (farm) {
        return farm;
      } else {
        this.router.navigate(['/warehouse-stakeholder', warehouseStakeholder]);
        return false;
      }
    });
  }
}
