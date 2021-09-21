import { Injectable }             from '@angular/core';
import { Router, Resolve,
  ActivatedRouteSnapshot } from '@angular/router';
import { Observable }             from 'rxjs/Observable';
import {Position} from "../position";
import {PositionService} from "../position.service";
import {AuthService} from "../../auth/auth.service";


@Injectable()
export class PositionDetailsResolve implements Resolve<Position> {
  constructor(private auth: AuthService,private service: PositionService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> | Promise<any> | any {
    if (!route.params['id']) {
      this.router.navigate(['/position-layer']);
      return false;
    }
    let id = route.params['id'];
    return this.service.find(this.auth.accessToken.warehouse.id,id).then(position => {
      if (position) {
        return position;
      } else {
        this.router.navigate(['/position-layer']);
        return false;
      }
    });
  }
}
