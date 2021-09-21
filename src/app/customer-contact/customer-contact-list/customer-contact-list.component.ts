import { Observable, Subject } from 'rxjs/Rx';
import { PersonMemoryService } from '../../person/person-memory.service';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { error } from 'util';
import { ErrorHandler } from '../../shared/errors/error-handler';
import { Logger } from '../../shared/logger/logger';
import { ModalManager } from '../../shared/modals/modal-manager';
import { Page } from '../../shared/page/page';
import { Search } from '../../shared/search/search';
import { Person } from '../../person/person';
import { CustomerContact } from '../customer-contact';
import { Notification } from './../../shared/notification/notification';
import { CustomerContactService } from './../customer-contact.service';

@Component({
  selector: 'app-customer-contact-list',
  templateUrl: './customer-contact-list.component.html'
})

export class CustomerContactListComponent implements OnInit, OnDestroy {
  @Input() person: Person;
  loading: boolean;
  error: boolean;
  deleteConfirm: ModalManager = new ModalManager();
  customerContactIdExclude: string = '';
  page: Page<CustomerContact> = new Page<CustomerContact>();
  search: Search = new Search();

  private subject = new Subject<any>();

  constructor(private customerContactService: CustomerContactService,
    private personMemoryService: PersonMemoryService,
    private errorHandler: ErrorHandler,
    private logger: Logger) { }

  ngOnInit(): void {
    this.loadPerson();
  }


  ngOnDestroy(): void {
    this.page.changeQuery.unsubscribe();
    this.search.destroy();
  }

  delete(customerContact: CustomerContact) {
    this.personMemoryService.deleteCustomerContact(customerContact);
    Notification.success('Contato excluído com sucesso!');
    this.loadPerson();
  }

  loadPerson() {
    this.error = false;
    this.loading = true;
    this.person = this.personMemoryService.person;
    this.loading = false;
  }


  handleError(error) {
    this.error = true;
    this.loading = false;
    return this.errorHandler.fromServer(error);
  }

  newCustomerContact() {
    this.personMemoryService.newCustomerContact();
  }

  editCustomerContact(ct: CustomerContact) {
    if (ct.id) {
      this.personMemoryService.editCustomerContact(ct.id);
    }else {
      this.personMemoryService.editCustomerContact(ct.tempId);
    }
  }

  detailsCustomerContact(ct: CustomerContact) {
    if (ct.id) {
      this.personMemoryService.detailsCustomerContact(ct.id);
    }else {
      this.personMemoryService.detailsCustomerContact(ct.tempId);
    }

  }

  isExclude(excludeEvent, ct: CustomerContact): void {
    excludeEvent.event.stopPropagation();
    if (excludeEvent.excluded) {
      this.loading = true;
      this.personMemoryService.deleteCustomerContact(ct);
    } else {
      this.customerContactIdExclude = '';
    }
    this.loading = false;
    this.loadPerson();
  }

  excludeOption(event: Event, customerContactOptions: CustomerContact): void {
    event.stopPropagation();
    if (customerContactOptions.id) {
      this.customerContactIdExclude = customerContactOptions.id;
    }else {
      this.customerContactIdExclude = customerContactOptions.tempId;
    }
  }

}
