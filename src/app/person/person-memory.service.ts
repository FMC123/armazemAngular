import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { ErrorHandler } from '../shared/errors/error-handler';
import { PersonService } from './person.service';
import { Address } from '../address/address';
import { CustomerContact } from '../customer-contact/customer-contact';
import { Person } from './person';
import { EventEmitter } from '@angular/common/src/facade/async';
import { Injectable } from '@angular/core';
import { Page } from './../shared/page/page';
import { Observable } from 'rxjs/Observable';


@Injectable()
export class PersonMemoryService {

  loading = false;
  mode: 'LIST'
      | 'FORM'
      | 'DETAILS'
      | 'FORM_CONTACT'
      | 'DETAILS_CONTACT'
      | 'FORM_ADDRESS'
      | 'DETAILS_ADDRESS'
      = 'LIST';

  select = new EventEmitter<string>();
  private _person?: Person;

  listCustomerContact: Array<CustomerContact> = new Array<CustomerContact>();
  customerContactId: string;
  addressId: string;
  personEditMoment: boolean = false;
  bootMode: string = 'default';
  listAddress: Array<Address> = new Array<Address>();

  get person() {
    return (this._person) ? this._person : new Person();
  }

  set person(person: Person) {
    this._person = person;
  }

  constructor(private personService: PersonService,
              private errorHandler: ErrorHandler,
              private auth: AuthService,
              private router: Router,
            ) {}


  findPerson(personId: string): Observable<any> | Promise<any> | any {

      if (!personId) {
    return Promise.resolve(new Person());
  }
  let id = personId;
    return this.personService.find(id).then(person  => {
      if (person) {
        if (!person.addresses) {
          person.addresses = new Array<Address>();
        }
        if (!person.customerContacts) {
          person.customerContacts = new Array<CustomerContact>();
        }
        return person;
      }
  }).catch((error) => this.handleCriticalError(error));
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

  saveCustomerContact(customerContact: CustomerContact): void {
    if (this._person && this._person.customerContacts){
      if (this._person.customerContacts.filter(

        ct => {
          return ((ct.id !== undefined && customerContact.id !== undefined && (ct.id === customerContact.id))
          || ct.tempId === customerContact.tempId);
        }
      ).length > 0) {
        let index = this._person.customerContacts.findIndex(ct => {
          return (!!customerContact.id && ct.id === customerContact.id)
          || (!!customerContact.tempId || ct.tempId === customerContact.tempId)
        });
        this._person.customerContacts.splice(index, 1);
        this._person.customerContacts.push(customerContact);
      }else {
        this._person.customerContacts.push(customerContact);
      }
    }
    this.customerContactId = null;
    this.router.navigate(['/person/new']);
  }

  saveAddress(address: Address): void {
    if (this._person && this._person.addresses){
      if (this._person.addresses.filter(
        ad => ((ad.id !== undefined && address.id !== undefined && (ad.id === address.id))
         || ad.tempId === address.tempId)
      ).length > 0) {
        let index = this._person.addresses.findIndex(ad => {
          return (!!address.id && ad.id === address.id)
          || (!!address.tempId || ad.tempId === address.tempId)
        });
        this._person.addresses.splice(index, 1);
        this._person.addresses.push(address);
      }else {
        this._person.addresses.push(address);
      }
    }
    this.addressId = null;
    this.router.navigate(['/person/new']);
  }

  deleteCustomerContact(customerContact: CustomerContact) {
    let index = this._person.customerContacts.findIndex(ct => {
      return (!!customerContact.id && ct.id === customerContact.id)
      || (!!customerContact.tempId || ct.tempId === customerContact.tempId)
    });

    this._person.customerContacts.splice(index, 1);
    this.router.navigate(['/person/new']);
  }

  addAddress(address: Address): void {
    if (this._person && this._person.addresses){
      this._person.addresses.push(address);
    }
    this.router.navigate(['/person/new']);
  }

  deleteAddress(address: Address): void{
    let index = this._person.addresses.findIndex(ct => {
      return (!!address.id && ct.id === address.id)
      || (!!address.tempId || ct.tempId === address.tempId)
    });

    this._person.addresses.splice(index, 1);
    this.router.navigate(['/person/new']);
  }

  newCustomerContact() {
    if (!this._person.customerContacts) {
      this._person.customerContacts = new Array<CustomerContact>();
    }
    this.customerContactId = null;
    this.router.navigate(['/customer-contact/new']);
  }

  editCustomerContact(id: string) {
    this.customerContactId = id;
    this.router.navigate(['/customer-contact/edit']);
  }

  detailsCustomerContact(id: string){
    this.customerContactId = id;
    this.router.navigate(['/customer-contact', this.customerContactId], { queryParams: { id: this.customerContactId } });
  }

  newAddress() {
    if (!this._person.addresses){
      this._person.addresses = new Array<Address>();
    }
    this.addressId = null;
    this.router.navigate(['/address/new']);
  }

  editAddress(id: string) {
    this.addressId = id;
    this.router.navigate(['/address/edit']);
  }

  detailsAddress(id: string) {
    this.addressId = id;
    this.router.navigate(['/address', this.addressId], { queryParams: { id: this.addressId } });
  }

  reset() {
    this.person = new Person();
    this.bootMode = 'default';
    this.personEditMoment = false;
    this.router.navigate(['/person']);
  }

  returnForm() {
    this.router.navigate(['/person/new']);
  }

  newPerson() {
    this._person = new Person();
    this._person.addresses = new Array<Address>();
    this._person.customerContacts = new Array<CustomerContact>();
    this.router.navigate(['/person/new']);
  }

  detailsPerson(p: Person) {
    this._person = p;
    this.router.navigate(['/person', p.id]);

  }

  editPerson(p: Person) {
    this._person = p;
    if (!this._person.addresses){
      this._person.addresses = new Array<Address>();
    }

    if (!this._person.customerContacts){
      this._person.customerContacts = new Array<CustomerContact>();
    }
    this.router.navigate(['/person/edit', p.id]);
  }

  findCustomerContact(id: number | string): CustomerContact {
    if (id) {
    return this._person.customerContacts.filter(
      ct => (ct.id === id || ct.tempId === id)
    )[0];
  }
    return null;
  }

  findAddress(id: number | string): Address  {
    if (id) {
    return this._person.addresses.filter(
      ad => (ad.id === id || ad.tempId === id)
    )[0];
  }
    return null;
  }


}
