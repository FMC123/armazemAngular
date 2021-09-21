import { ModalManager } from '../../shared/modals/modal-manager';

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Notification } from './../../shared/notification/notification';
import {EconomicGroup} from '../economic-group';
import {EconomicGroupService} from '../economic-group.service';

@Component({
  selector: 'app-economic-group-list-details',
  templateUrl: './economic-group-list-details.component.html'
})
export class EconomicGroupDetailsComponent implements OnInit {
  economicGroup: EconomicGroup;

  constructor(private route: ActivatedRoute,
              private economicGroupService: EconomicGroupService) { }

  ngOnInit() {
    Notification.clearErrors();
    this.route.data.forEach((data: {economicGroup: EconomicGroup}) => {
      this.economicGroup = data.economicGroup;
    });
  }

}
