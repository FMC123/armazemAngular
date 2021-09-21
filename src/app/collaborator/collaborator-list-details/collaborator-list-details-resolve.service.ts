import { Injectable }             from '@angular/core';
import { Router, Resolve,
         ActivatedRouteSnapshot } from '@angular/router';
import { Observable }             from 'rxjs/Observable';
import {Collaborator} from "../collaborator";
import {CollaboratorService} from "../collaborator.service";


@Injectable()
export class collaboratorDetailsResolve implements Resolve<Collaborator> {
  constructor(private service: CollaboratorService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> | Promise<any> | any {
    if (!route.params['id']) {
      this.router.navigate(['/collaborator']);
      return false;
    }
    let id = route.params['id'];
    return this.service.find(id).then(collaborator => {
      if (collaborator) {
        return collaborator;
      } else {
        this.router.navigate(['/collaborator']);
        return false;
      }
    });
  }
}
