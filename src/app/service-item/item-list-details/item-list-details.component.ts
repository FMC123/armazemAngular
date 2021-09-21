import { ServiceItemService } from '../service-item.service';
import { ServiceItem } from '../service-item';
import { ModalManager } from '../../shared/modals/modal-manager';

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Notification } from './../../shared/notification/notification';


@Component({
  selector: 'app-item-list-details',
  templateUrl: './item-list-details.component.html'
})
export class ItemDetailsComponent implements OnInit {
  serviceItem: ServiceItem;

  constructor(private route: ActivatedRoute,
              private itemService: ServiceItemService) { }

  ngOnInit() {
    Notification.clearErrors();
    this.route.data.forEach((data: {item: ServiceItem}) => {
      this.serviceItem = data.item;
    });
  }

}
