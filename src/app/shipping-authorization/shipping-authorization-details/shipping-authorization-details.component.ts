import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Notification } from './../../shared/notification/notification';
import { ShippingAuthorization } from './../shipping-authorization';

@Component({
  selector: 'app-shipping-authorization-details',
  templateUrl: './shipping-authorization-details.component.html'
})
export class ShippingAuthorizationDetailsComponent implements OnInit {
  shippingAuthorization: ShippingAuthorization;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    Notification.clearErrors();
    this.route.data.forEach((data: {shippingAuthorization: ShippingAuthorization}) => {
      this.shippingAuthorization = data.shippingAuthorization;
    });
  }

}
