import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Notification } from './../../shared/notification/notification';
import { ServiceRequest } from './../service-request';

@Component({
  selector: 'app-service-request-details',
  templateUrl: './service-request-details.component.html'
})
export class ServiceRequestDetailsComponent implements OnInit {
  serviceRequest: ServiceRequest;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    Notification.clearErrors();
    this.route.data.forEach((data: { serviceRequest: ServiceRequest }) => {
      this.serviceRequest = data.serviceRequest;
    });
  }

}
