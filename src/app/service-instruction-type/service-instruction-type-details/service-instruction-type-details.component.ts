import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Notification } from './../../shared/notification/notification';
import { ServiceInstructionType } from './../service-instruction-type';

@Component({
  selector: 'app-service-instruction-type-details',
  templateUrl: './service-instruction-type-details.component.html'
})
export class ServiceInstructionTypeDetailsComponent implements OnInit {
  serviceInstructionType: ServiceInstructionType;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    Notification.clearErrors();
    this.route.data.forEach((data: { serviceInstructionType: ServiceInstructionType }) => {
      this.serviceInstructionType = data.serviceInstructionType;
    });
  }

}
