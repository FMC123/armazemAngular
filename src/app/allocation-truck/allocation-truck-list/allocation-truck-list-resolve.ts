import { AllocationTruck } from '../allocation-truck';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';
import { access } from 'fs';
import { Observable } from 'rxjs/Observable';
import { ErrorHandler } from './../../shared/errors/error-handler';
import { AuthService } from '../../auth/auth.service';
import { AllocationTruckService } from 'app/allocation-truck/allocation-truck.service';

@Injectable()
export class AllocationTruckListResolve implements Resolve<AllocationTruck> {
  constructor(private service: AllocationTruckService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> | Promise<any> | any {

    if (!route.params['id']) {
      this.router.navigate(['/map-realtime']);
      return false;
    }

    let id = route.params['id'];
    return this.service.find(id).then(allocationTruck => {
      if (allocationTruck) {
        return allocationTruck;
      } else {
        this.router.navigate(['/map-realtime']);
        return false;
      }
    });
  }
}
