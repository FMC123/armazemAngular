import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Notification } from './../../shared/notification/notification';
import { PurchaseProspect } from './../purchase-prospect';

@Component({
  selector: 'app-purchase-prospect-details',
  templateUrl: './purchase-prospect-details.component.html'
})
export class PurchaseProspectDetailsComponent implements OnInit {
  purchaseProspect: PurchaseProspect;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    Notification.clearErrors();
    this.route.data.forEach((data: { purchaseProspect: PurchaseProspect }) => {
      this.purchaseProspect = data.purchaseProspect;
    });
  }

}
