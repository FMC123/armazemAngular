import { Injectable }             from '@angular/core';
import { Router, Resolve,
         ActivatedRouteSnapshot } from '@angular/router';
import { Observable }             from 'rxjs/Observable';
import { Person } from '../../person/person';
import { PersonService } from '../../person/person.service';
import { Address } from '../address';
import { TypeAddress} from '../type-address';
import { AddressService } from '../address.service';


@Injectable()
export class AddressDetailsResolve implements Resolve<string> {
  constructor(private service: AddressService,
              private personService: PersonService,
               private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> | Promise<any> | any {
    let id = route.params['id'];
    return id;
  }
}
