import { CustomerContact } from '../../customer-contact/customer-contact';
import { Address } from '../../address/address';
import { debug } from 'util';
import { PersonMemoryService } from '../person-memory.service';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ModalManager } from '../../shared/modals/modal-manager';
import { Person } from '../person';
import { PersonService } from '../person.service';
import { Notification } from './../../shared/notification/notification';


@Component({
  selector: 'app-person-list-details',
  templateUrl: './person-list-details.component.html'
})
export class PersonListDetailsComponent implements OnInit{
  @Input() returnActive: boolean;
  @Input() person: Person;

  constructor(
    private personService: PersonService,
    private personMemoryService: PersonMemoryService,
    private route: ActivatedRoute,
  ) { }


  returList() {
    this.personMemoryService.reset();
  }


    public ngOnInit(): void {
      this.route.data.forEach((data: {person: Person}) => {
        this.person = data.person;
        if(!this.person){
          this.person = this.personMemoryService.person;
        }
      });

       if (!this.person.addresses) {
          this.person.addresses = new Array<Address>();
       }

       if (!this.person.customerContacts) {
        this.person.customerContacts = new Array<CustomerContact>();
     }
    }
}
