import { CultivationService } from '../cultivation.service';
import { ModalManager } from '../../shared/modals/modal-manager';

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Notification } from './../../shared/notification/notification';
import {Cultivation} from '../cultivation';

@Component({
  selector: 'app-cultivation-list-details',
  templateUrl: './cultivation-list-details.component.html'
})
export class CultivationDetailsComponent implements OnInit {
  cultivation: Cultivation;

  constructor(private route: ActivatedRoute,
              private cultivationService: CultivationService) { }

  ngOnInit() {
    Notification.clearErrors();
    this.route.data.forEach((data: {cultivation: Cultivation}) => {
      this.cultivation = data.cultivation;
    });
  }

}
