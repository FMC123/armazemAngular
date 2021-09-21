import { ModalManager } from '../../shared/modals/modal-manager';

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Notification } from './../../shared/notification/notification';
import {Farm} from '../farm';
import {FarmService} from '../farm.service';

@Component({
  selector: 'app-farm-list-details',
  templateUrl: './farm-list-details.component.html'
})
export class FarmDetailsComponent implements OnInit {
  farm: Farm;

  constructor(private route: ActivatedRoute,
              private farmService: FarmService) { }

  ngOnInit() {
    ;
    Notification.clearErrors();
    this.route.data.forEach((data: {farm: Farm}) => {
      this.farm = data.farm;
    });
  }

}
