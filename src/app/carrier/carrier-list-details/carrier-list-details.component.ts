import { ModalManager } from '../../shared/modals/modal-manager';

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Notification } from './../../shared/notification/notification';
import {Carrier} from "../carrier";
import {CarrierService} from "../carrier.service";

@Component({
  selector: 'app-carrier-list-details',
  templateUrl: './carrier-list-details.component.html'
})
export class CarrierDetailsComponent implements OnInit {
  carrier: Carrier;

  constructor(private route: ActivatedRoute,
              private carrierService: CarrierService) { }

  ngOnInit() {
    Notification.clearErrors();
    this.route.data.forEach((data: {carrier: Carrier}) => {
      this.carrier = data.carrier;
    });
  }

}
