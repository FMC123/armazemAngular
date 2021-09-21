import { Injectable }             from '@angular/core';
import { Router, Resolve,
         ActivatedRouteSnapshot } from '@angular/router';
import { Observable }             from 'rxjs/Observable';
import { Person } from '../../person/person';
import { PersonService } from '../../person/person.service';
import { CustomerContact } from '../customer-contact';
import { CustomerContactService } from '../customer-contact.service';



@Injectable()
export class CustomerContactListDetailsResolve implements Resolve<string> {
  constructor(private service: CustomerContactService,
              private personService: PersonService,
               private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> | Promise<any> | any {

    let id = route.params['id'];

    return id;
  }
}
