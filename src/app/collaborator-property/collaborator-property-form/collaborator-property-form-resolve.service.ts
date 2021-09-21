import { Injectable } from '@angular/core';
import { Router, Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable }             from 'rxjs/Observable';

import { CollaboratorProperty } from '../collaborator-property';
import { CollaboratorPropertyService } from '../collaborator-property.service';

@Injectable()
export class CollaboratorPropertyFormResolve implements Resolve<CollaboratorProperty> {
  constructor(
    private service: CollaboratorPropertyService,
    private router: Router,
  ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> | Promise<any> | any {

    if (!route.params['id']) {
      return Promise.resolve(new CollaboratorProperty());
    }

    let id = route.params['id'];
    return this.service.find(id).then(collaboratorProperty => {
      if (collaboratorProperty) {
          return collaboratorProperty;
      } else {
          this.router.navigate(['/collaborator-property']);
          return false;
      }
    });
  }
}
