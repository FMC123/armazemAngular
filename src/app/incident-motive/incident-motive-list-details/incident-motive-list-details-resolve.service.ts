import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { IncidentMotive } from '../incident-motive';
import { IncidentMotiveService } from '../incident-motive.service';


@Injectable()
export class IncidentMotiveDetailsResolve implements Resolve<IncidentMotive> {
  constructor(private service: IncidentMotiveService, private router: Router) { }

  resolve(route: ActivatedRouteSnapshot): Observable<any> | Promise<any> | any {
    if (!route.params['id']) {
      this.router.navigate(['/motive-control']);
      return false;
    }
    let id = route.params['id'];
    return this.service.find(id).then(motiveControl => {
      if (motiveControl) {
        return motiveControl;
      } else {
        this.router.navigate(['/motive-control']);
        return false;
      }
    });
  }
}
