import { ServiceGroupService } from '../service-group.service';
import { ServiceGroup } from '../service-group';
import { ModalManager } from '../../shared/modals/modal-manager';

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Notification } from './../../shared/notification/notification';

@Component({
  selector: 'app-service-group-list-details',
  templateUrl: './service-group-list-details.component.html'
})
export class ServiceGroupDetailsComponent implements OnInit {
  serviceGroup: ServiceGroup;

  constructor(private route: ActivatedRoute,
              private serviceGroupService: ServiceGroupService) { }

  ngOnInit() {
    Notification.clearErrors();
    this.route.data.forEach((data: {serviceGroup: ServiceGroup}) => {
      this.serviceGroup = data.serviceGroup;
    });
  }

}
