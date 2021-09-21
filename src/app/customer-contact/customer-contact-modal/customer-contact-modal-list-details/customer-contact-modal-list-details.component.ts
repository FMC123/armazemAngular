import { PersonModalService } from '../../../person/person-modal/person-modal.service';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ModalManager } from '../../../shared/modals/modal-manager';
import { CustomerContact } from '../../customer-contact';
import { CustomerContactService } from '../../customer-contact.service';
import { Notification } from './../../../shared/notification/notification';


@Component({
  selector: 'app-customer-contact-modal-list-details',
  templateUrl: './customer-contact-modal-list-details.component.html'
})
export class CustomerContactModalDetailsComponent implements OnInit {
  @Input() id: string;
  customerContact: CustomerContact;

  constructor(private route: ActivatedRoute,
              private customerContactService: CustomerContactService,
              private serviceModalPerson: PersonModalService,
            ) { }

  ngOnInit() {

    Notification.clearErrors();
    this.customerContact = this.serviceModalPerson.findCustomerContact(this.id);
  }

  returnFormPerson() {
    this.serviceModalPerson.returnForm();
  }

}
