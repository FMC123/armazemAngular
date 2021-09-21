import { ModalManager } from '../../shared/modals/modal-manager';

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Notification } from './../../shared/notification/notification';
import {Forklift} from '../forklift';
import {ForkliftService} from '../forklift.service';

@Component({
  selector: 'app-forklift-list-details',
  templateUrl: './forklift-list-details.component.html'
})
export class ForkliftDetailsComponent implements OnInit {
  forklift: Forklift;

  constructor(private route: ActivatedRoute,
              private forkliftService: ForkliftService) { }

  ngOnInit() {
    Notification.clearErrors();
    this.route.data.forEach((data: {forklift: Forklift}) => {
      this.forklift = data.forklift;
    });
  }

}
