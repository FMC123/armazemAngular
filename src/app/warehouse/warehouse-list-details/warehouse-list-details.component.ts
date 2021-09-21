import { ModalManager } from '../../shared/modals/modal-manager';

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Notification } from './../../shared/notification/notification';
import {Warehouse} from '../warehouse';
import {WarehouseService} from '../warehouse.service';

@Component({
  selector: 'app-warehouse-list-details',
  templateUrl: './warehouse-list-details.component.html'
})
export class WarehouseDetailsComponent implements OnInit {
  warehouse: Warehouse;

  constructor(private route: ActivatedRoute,
              private warehouseService: WarehouseService) { }

  ngOnInit() {
    Notification.clearErrors();
    this.route.data.forEach((data: {warehouse: Warehouse}) => {
      this.warehouse = data.warehouse;
    });
  }

}
