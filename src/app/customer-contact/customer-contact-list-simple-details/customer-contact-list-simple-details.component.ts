import { CustomerContact } from '../customer-contact';
import { Component, OnInit, Input } from '@angular/core';
import { Formatter } from '../../shared/forms/formatter/Formatter';


@Component({
  selector: 'app-customer-contact-list-simple-details',
  templateUrl: './customer-contact-list-simple-details.component.html'
})
export class CustomerContactListSimpleDetailsComponent implements OnInit {
  @Input() public customerContacts: Array<CustomerContact> = [];
  customerContact: CustomerContact = new CustomerContact();
  constructor() { }

  ngOnInit() {
   }

  formatPhone(phone: string): string {
    return Formatter.phoneFormat(phone);
  }

}
