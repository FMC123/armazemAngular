import { PersonMemoryService } from '../../person/person-memory.service';
import { Component, OnInit, OnDestroy, Input }      from '@angular/core';

import { Page } from '../../shared/page/page';
import { ErrorHandler, ModalManager, Search } from '../../shared/shared.module';
import { Person } from '../../person/person';
import { Address } from '../address';
import { TypeAddress } from '../type-address'
import { Notification } from './../../shared/notification/notification';
import { Logger } from '../../shared/logger/logger';
import { AddressService } from '../address.service';

@Component({
  selector: 'app-address-list',
  templateUrl: './address-list.component.html'
})
export class AddressListComponent implements OnInit, OnDestroy {
  @Input() person: Person;
  loading: boolean;
  error: boolean;
  deleteConfirm: ModalManager = new ModalManager();
  addressIdExclude: string = '';
  page: Page<Address> = new Page<Address>();
  search: Search = new Search();

  constructor(private addressService: AddressService,
              private personMemoryService: PersonMemoryService,
              private errorHandler: ErrorHandler,
              private logger: Logger) {}

  ngOnInit() {
    this.loadPerson();
  }

  loadPerson() {
    this.error = false;
    this.loading = true;
    this.person = this.personMemoryService.person;
    this.loading = false;
  }

  newAddress() {
    this.personMemoryService.newAddress();
  }

  editAddress(ad: Address) {
    this.personMemoryService.editAddress(this.idOrTempId(ad));
  }

  detailsAddress(ad: Address){
    this.personMemoryService.detailsAddress(this.idOrTempId(ad));
  }

  idOrTempId(address){
    return address.id ? address.id : address.tempId;
  }

  isExclude(excludeEvent, ad: Address): void {
    excludeEvent.event.stopPropagation();
    if (excludeEvent.excluded) {
      this.loading = true;
      this.personMemoryService.deleteAddress(ad);
    } else {
      this.addressIdExclude = '';
    }
    this.loading = false;
    this.loadPerson();
  }

  excludeOption(event: Event, addresstOptions: Address): void {
    event.stopPropagation();
    if (addresstOptions.id) {
    this.addressIdExclude = addresstOptions.id;
    }else {
      this.addressIdExclude = addresstOptions.tempId;
    }
  }

  loadList() {
    this.error = false;
    this.loading = true;
    this.addressService.listPaged(this.person.id, this.page).then(() => {
    this.loading = false;
    }).catch(error => this.handleError(error));
  }

  delete(id: string | number) {
    this.addressService.delete(this.person.id, id).then(() => {
      Notification.success('Endereço excluído com sucesso!');
      this.loadList();
    }).catch(error => this.handleError(error));
  }

  ngOnDestroy() {
    this.page.changeQuery.unsubscribe();
    this.search.destroy();
  }

  handleError(error){
    this.error = true;
    this.loading = false;
    return this.errorHandler.fromServer(error);
  }
}
