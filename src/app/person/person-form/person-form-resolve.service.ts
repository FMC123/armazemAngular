import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';
import { access } from 'fs';
import { Observable } from 'rxjs/Observable';

import { PersonService } from '../person.service';
import { Person } from '../person';
import { ErrorHandler } from './../../shared/errors/error-handler';
import { AuthService } from '../../auth/auth.service';
@Injectable()
export class PersonFormResolve implements Resolve<Position> {
  loading: boolean;
  error: boolean;
  person: Person;

  constructor(private auth: AuthService,
    private service: PersonService,
              private errorHandler: ErrorHandler,
              private router: Router,
              ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> | Promise<any> | any {
        if (!route.params['id']) {
          let id = route.params['id'];
      return id;
    }
    return;
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
