import { Injectable } from '@angular/core';
import { Router, Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { collaboratorProperty } from '../../collaborator-property/collaborator-property';
import { collaboratorPropertyService } from '../../collaborator-property/collaborator-property.service';

@Injectable()
export class CollaboratorPropertyListDetailsResolve implements Resolve<collaboratorProperty> {
  constructor(private service: collaboratorPropertyService,
              private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> | Promise<any> | any {

    let id = route.params['id'];

    return this.service.find(id).then(collaboratorProperty => {
      if (collaboratorProperty) {
        return collaboratorProperty;
      } else {
        this.router.navigate(['/collaborator-property', collaboratorProperty]);
        return false;
      }
    });
  }
}
