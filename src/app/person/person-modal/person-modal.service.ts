import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { ErrorHandler } from '../../shared/errors/error-handler';
import { PersonService } from '../person.service';
import { Address } from '../../address/address';
import { CustomerContact } from '../../customer-contact/customer-contact';
import { Person } from '../person';
import { EventEmitter } from '@angular/common/src/facade/async';
import { Injectable } from '@angular/core';
import { Page } from './../../shared/page/page';
import { Observable } from 'rxjs/Observable';


@Injectable()
export class PersonModalService {

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
    return this.personService.find(id).then(person => {
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
        ct => (ct.id === customerContact.id || ct.tempId === customerContact.tempId)
      )) {
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
    this.mode = 'FORM';
  }

  saveAddress(address: Address): void {
    if (this._person && this._person.addresses){
      if (this._person.addresses.filter(
        ad => (ad.id === address.id || ad.tempId === address.tempId)
      )) {
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
    this.mode = 'FORM';
  }

  deleteCustomerContact(customerContact: CustomerContact) {
    let index = this._person.customerContacts.findIndex(ct => {
      return (!!customerContact.id && ct.id === customerContact.id)
      || (!!customerContact.tempId || ct.tempId === customerContact.tempId)
    });

    this._person.customerContacts.splice(index, 1);
    this.mode = 'FORM';
  }

  addAddress(address: Address): void {
    if (this._person && this._person.addresses){
      this._person.addresses.push(address);
    }
    this.mode = 'FORM';
  }

  deleteAddress(address: Address): void{
    let index = this._person.addresses.findIndex(ct => {
      return (!!address.id && ct.id === address.id)
      || (!!address.tempId || ct.tempId === address.tempId)
    });

    this._person.addresses.splice(index, 1);
    this.mode = 'FORM';
  }

  newCustomerContact() {
    this.customerContactId = null;
    this.mode = 'FORM_CONTACT';
  }

  editCustomerContact(id: string){
    this.customerContactId = id;
    this.mode = 'FORM_CONTACT';
  }

  detailsCustomerContact(id: string){
    this.customerContactId = id;
    this.mode = 'DETAILS_CONTACT';
  }

  newAddress() {
    this.addressId = null;
    this.mode = 'FORM_ADDRESS';
  }

  editAddress(id: string) {
    this.addressId = id;
    this.mode = 'FORM_ADDRESS';
  }

  detailsAddress(id: string) {
    this.addressId = id;
    this.mode = 'DETAILS_ADDRESS';
  }

  reset() {
    this.person = new Person();
    this.bootMode = 'default';
    this.personEditMoment = false;
    this.mode = 'LIST';
  }

  returnForm() {
    this.mode = 'FORM';
  }

  newPerson() {
    this._person = new Person();
    this._person.addresses = new Array<Address>();
    this._person.customerContacts = new Array<CustomerContact>();
    this.mode = 'FORM';
  }

  detailsPerson(p: Person) {
    this._person = p;
    this.mode = 'DETAILS';
  }

  editPerson(p: Person) {
    this._person = p;
    if (!this._person.addresses){
      this._person.addresses = new Array<Address>();
    }

    if (!this._person.customerContacts){
      this._person.customerContacts = new Array<CustomerContact>();
    }
    this.mode = 'FORM';
  }

  findCustomerContact(id: number | string): CustomerContact {
    if (id) {
    return this._person.customerContacts.filter(
      ct => (ct.id === id || ct.tempId === id)
    )[0];
  }
    return null;
  }

  findAddress(id: number | string): Address {
    if (id) {
    return this._person.addresses.filter(
      ad => (ad.id === id || ad.tempId === id)
    )[0];
  }
    return null;
  }


}
