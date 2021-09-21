import { Person } from '../person';
import { PersonService } from '../person.service';

import { Injectable } from '@angular/core';
import { Router, Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { ErrorHandler } from 'app/shared/errors/error-handler';



@Injectable()
export class PersonDetailsResolve implements Resolve<Person> {
  constructor(private service: PersonService, private router: Router, private errorHandler: ErrorHandler) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> | Promise<any> | any {
    if (!route.params['id']) {
      this.router.navigate(['/person']);
      return false;
    }
    let id = route.params['id'];
     return this.service.find(id).then(person => {
        if (person) {
          return person;
        } else {
          this.router.navigate(['/person']);
          return false;
        }
    }).catch((error) => this.errorHandler.fromServer(error));
  }
}
