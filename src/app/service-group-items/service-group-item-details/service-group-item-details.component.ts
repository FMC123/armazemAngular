import { ServiceGroupItemService } from '../service-group-item.service';
import { ServiceGroupItem } from '../service-group-item';

import { ModalManager } from '../../shared/modals/modal-manager';

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Notification } from './../../shared/notification/notification';

@Component({
  selector: 'app-service-group-item-details',
  templateUrl: './service-group-item-details.component.html'
})
export class ServiceGroupItemDetailsComponent implements OnInit {
  serviceGroupItem: ServiceGroupItem;

  constructor(private route: ActivatedRoute,
              private serviceGroupItemService: ServiceGroupItemService) { }

  ngOnInit() {
    Notification.clearErrors();
    this.route.data.forEach((data: {serviceGroupItem: ServiceGroupItem}) => {
      this.serviceGroupItem = data.serviceGroupItem;
    });
  }

}
