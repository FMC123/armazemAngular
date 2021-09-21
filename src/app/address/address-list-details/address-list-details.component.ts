import { ModalManager } from '../../shared/modals/modal-manager';

import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Notification } from './../../shared/notification/notification';
import { Address } from '../address';
import { TypeAddress } from '../type-address';
import { AddressService } from '../address.service';
import { PersonMemoryService } from '../../person/person-memory.service';


@Component({
  selector: 'app-address-list-details',
  templateUrl: './address-list-details.component.html'
})
export class AddressDetailsComponent implements OnInit {
  @Input() id: string;
  address: Address;

  constructor(private route: ActivatedRoute,
              private addressService: AddressService,
              private personMemoryService: PersonMemoryService,
            ) { }

  ngOnInit() {

    this.route.data.forEach((data: {address: string}) => {
      this.id = data.address;
    });
    Notification.clearErrors();
    if (!this.id) {
      this.id = this.personMemoryService.addressId;
    }
    this.address = this.personMemoryService.findAddress(this.id);
  }

  returFormPerson( ){
    this.personMemoryService.returnForm();
  }
}
