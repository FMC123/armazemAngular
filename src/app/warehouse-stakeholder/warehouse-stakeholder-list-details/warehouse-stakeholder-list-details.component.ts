import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ModalManager } from '../../shared/modals/modal-manager';
import { WarehouseStakeholder } from '../warehouse-stakeholder';
import { WarehouseStakeholderService } from '../warehouse-stakeholder.service';
import { CustomerContact } from '../../customer-contact/customer-contact';
import { Address } from '../../address/address';
import { Notification } from './../../shared/notification/notification';


@Component({
  selector: 'app-warehouse-stakeholder-list-details',
  templateUrl: './warehouse-stakeholder-list-details.component.html'
})
export class WarehouseStakeholderDetailsComponent implements OnInit {
  @Input() warehouseStakeholder: WarehouseStakeholder;

  constructor(private route: ActivatedRoute,
              private warehouseStakeholderService: WarehouseStakeholderService) { }

  ngOnInit() {
    Notification.clearErrors();
    this.route.data.forEach((data: {warehouseStakeholder: WarehouseStakeholder}) => {

      this.warehouseStakeholder = data.warehouseStakeholder;
    });
    if (!this.warehouseStakeholder.person.addresses) {
      this.warehouseStakeholder.person.addresses = new Array<Address>();
    }

    if (!this.warehouseStakeholder.person.customerContacts) {
      this.warehouseStakeholder.person.customerContacts = new Array<CustomerContact>();
    }
  }

  get storageServiceCarencia(): string {
      if (this.warehouseStakeholder.storageServiceCarencia) {
        return `${this.warehouseStakeholder.storageServiceCarencia.code} - ${this.warehouseStakeholder.storageServiceCarencia.description}`;
      }
    return '';
  }

  get storageService(): string {
    if (this.warehouseStakeholder.storageService) {
      return `${this.warehouseStakeholder.storageService.code} - ${this.warehouseStakeholder.storageService.description}`;
    }
  return '';
}

get insuranceService(): string {
  if (this.warehouseStakeholder.insuranceService) {
    return `${this.warehouseStakeholder.insuranceService.code} - ${this.warehouseStakeholder.insuranceService.description}`;
  }
return '';
}

get insuranceServiceCarencia(): string {
  if (this.warehouseStakeholder.insuranceServiceCarencia) {
    return `${this.warehouseStakeholder.insuranceServiceCarencia.code} - ${this.warehouseStakeholder.insuranceServiceCarencia.description}`;
  }
return '';
}

get serviceGroup(): string {
  if (this.warehouseStakeholder.serviceGroup) {
    return `${this.warehouseStakeholder.serviceGroup.code} - ${this.warehouseStakeholder.serviceGroup.description}`;
  }
return '';
}

}
