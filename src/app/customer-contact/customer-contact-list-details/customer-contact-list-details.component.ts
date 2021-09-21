import { PersonMemoryService } from '../../person/person-memory.service';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ModalManager } from '../../shared/modals/modal-manager';
import { CustomerContact } from '../customer-contact';
import { CustomerContactService } from '../customer-contact.service';
import { Notification } from './../../shared/notification/notification';


@Component({
  selector: 'app-customer-contact-list-details',
  templateUrl: './customer-contact-list-details.component.html'
})
export class CustomerContactDetailsComponent implements OnInit {
  @Input() id: string;
  customerContact: CustomerContact;

  constructor(private route: ActivatedRoute,
              private customerContactService: CustomerContactService,
              private personMemoryService: PersonMemoryService,
            ) { }

  ngOnInit() {
    this.route.data.forEach((data: {customerContact: string}) => {
      this.id = data.customerContact;
    });

    if (!this.id) {
      this.id = this.personMemoryService.customerContactId;
    }

    Notification.clearErrors();
    this.customerContact = this.personMemoryService.findCustomerContact(this.id);
  }

  returnFormPerson() {
    this.personMemoryService.returnForm();
  }

}
