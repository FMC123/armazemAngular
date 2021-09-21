import { Injectable }             from '@angular/core';
import { Router, Resolve,
         ActivatedRouteSnapshot } from '@angular/router';
import { Observable }             from 'rxjs/Observable';

import { PersonService } from '../../person/person.service';
import { Address } from '../address';
import { AddressService } from '../address.service';

@Injectable()
export class AddressFormResolve implements Resolve<Address> {
  constructor(
    private personService: PersonService,
    private service: AddressService,
    private router: Router,
  ) {}

   resolve(route: ActivatedRouteSnapshot): Observable<any> | Promise<any> | any {
    let id = route.params['id'];
    let person = route.params['person'];
    if (!id) {
      let address = new Address();
      return this.personService.find(person).then((person) => {
        address.person = person;
        return address;
      });
    }
    return this.service.findOne(person, id).then(address => {
      if (address) {
        return address;
      } else {
        this.router.navigate(['/person', person, 'address']);
        return false;
      }
    });
  }
}
