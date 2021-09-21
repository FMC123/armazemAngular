import { Injectable }             from '@angular/core';
import { Router, Resolve,
         ActivatedRouteSnapshot } from '@angular/router';
import { Observable }             from 'rxjs/Observable';

import { PersonService } from '../../person/person.service';
import { CustomerContact } from '../customer-contact';
import { CustomerContactService } from '../customer-contact.service';

@Injectable()
export class CustomerContactResolve implements Resolve<CustomerContact> {
  constructor(
    private personService: PersonService,
    private service: CustomerContactService,
    private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> | Promise<any> | any {
   let id = route.params['id'];
   let person = route.params['person'];
    if (!id) {
      let customerContact = new CustomerContact;
       return this.personService.find(person).then((person) => {
      customerContact.person = person;
      return customerContact;
       });
    }
    return this.service.findOne(person, id).then(customerContact => {
      if (customerContact) {
        return customerContact;
      } else {
        this.router.navigate(['/person', person, 'customer-contact']);
        return false;
      }
    });
  }
}


