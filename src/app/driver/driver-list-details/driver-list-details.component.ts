import { ModalManager } from '../../shared/modals/modal-manager';

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Notification } from '../../shared/notification';
import {Driver} from "../driver";
import {DriverService} from "../driver.service";

@Component({
  selector: 'app-driver-list-details',
  templateUrl: './driver-list-details.component.html'
})
export class DriverDetailsComponent implements OnInit {
  driver: Driver;

  constructor(private route: ActivatedRoute,
              private driverService: DriverService) { }

  ngOnInit() {
    Notification.clearErrors();
    this.route.data.forEach((data: {driver: Driver}) => {
      this.driver = data.driver;
    });
  }

}
