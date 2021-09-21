import { ModalManager } from '../../shared/modals/modal-manager';

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Notification } from './../../shared/notification/notification';
import {PositionService} from "../position.service";
import {Position} from "../position";

@Component({
  selector: 'app-position-list-details',
  templateUrl: './position-list-details.component.html'
})
export class PositionDetailsComponent implements OnInit {
  position: Position;

  constructor(private route: ActivatedRoute,
              private positionService: PositionService) { }

  ngOnInit() {
    Notification.clearErrors();
    this.route.data.forEach((data: {position: Position}) => {
      this.position = data.position;
    });
  }

}
