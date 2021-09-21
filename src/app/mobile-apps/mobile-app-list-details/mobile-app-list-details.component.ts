import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MobileApp } from 'app/mobile-apps/mobile-app';
import { MobileAppService } from 'app/mobile-apps/mobile-app.service';

import { Notification } from './../../shared/notification/notification';


@Component({
  selector: 'app-mobile-app-list-details',
  templateUrl: './mobile-app-list-details.component.html'
})
export class MobileAppDetailsComponent implements OnInit {
  mobileApp: MobileApp;

  constructor(private route: ActivatedRoute,
    private mobileAppService: MobileAppService) { }

  ngOnInit() {
    Notification.clearErrors();
    this.route.data.forEach((data: { mobileApp: MobileApp }) => {
      this.mobileApp = data.mobileApp;
    });
  }

}
