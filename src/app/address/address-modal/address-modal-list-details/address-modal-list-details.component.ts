import { ModalManager } from '../../../shared/modals/modal-manager';

import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Notification } from './../../../shared/notification/notification';
import { Address } from '../../address';
import { TypeAddress } from '../../type-address';
import { AddressService } from '../../address.service';
import { PersonModalService } from '../../../person/person-modal/person-modal.service';


@Component({
  selector: 'app-address-modal-list-details',
  templateUrl: './address-modal-list-details.component.html'
})
export class AddressModalDetailsComponent implements OnInit {
  @Input() id: string;
  address: Address;

  constructor(private route: ActivatedRoute,
              private addressService: AddressService,
              private personModalService: PersonModalService,
            ) { }

  ngOnInit() {
    Notification.clearErrors();
    this.address = this.personModalService.findAddress(this.id);
  }

  returFormPerson( ){
    this.personModalService.returnForm();
  }
}
