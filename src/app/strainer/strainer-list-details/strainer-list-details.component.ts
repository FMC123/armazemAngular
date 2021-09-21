import { ModalManager } from '../../shared/modals/modal-manager';

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Notification } from './../../shared/notification/notification';
import {Strainer} from '../strainer';
import {StrainerService} from '../strainer.service';

@Component({
  selector: 'app-strainer-list-details',
  templateUrl: './strainer-list-details.component.html'
})
export class StrainerDetailsComponent implements OnInit {
  strainer: Strainer;

  constructor(private route: ActivatedRoute,
              private strainerService: StrainerService) { }

  ngOnInit() {
    Notification.clearErrors();
    this.route.data.forEach((data: {strainer: Strainer}) => {
      this.strainer = data.strainer;
    });
  }
}
