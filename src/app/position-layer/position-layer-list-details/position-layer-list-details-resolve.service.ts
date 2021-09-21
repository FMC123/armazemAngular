import { Injectable }             from '@angular/core';
import { Router, Resolve,
         ActivatedRouteSnapshot } from '@angular/router';
import { Observable }             from 'rxjs/Observable';
import {PositionLayer} from "../position-layer";
import {PositionLayerService} from "../position-layer.service";


@Injectable()
export class PositionLayerDetailsResolve implements Resolve<PositionLayer> {
  constructor(private service: PositionLayerService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> | Promise<any> | any {
    if (!route.params['id']) {
      this.router.navigate(['/position-layer']);
      return false;
    }
    let id = route.params['id'];
    return this.service.find(id).then(positionLayer => {
      if (positionLayer) {
        return positionLayer;
      } else {
        this.router.navigate(['/position-layer']);
        return false;
      }
    });
  }
}
