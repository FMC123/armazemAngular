import { ModalManager } from '../../shared/modals/modal-manager';

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Notification } from './../../shared/notification/notification';
import {PositionLayer} from "../position-layer";
import {PositionLayerService} from "../position-layer.service";

@Component({
  selector: 'app-position-layer-list-details',
  templateUrl: './position-layer-list-details.component.html'
})
export class PositionLayerDetailsComponent implements OnInit {
  positionLayer: PositionLayer;

  constructor(private route: ActivatedRoute,
              private positionLayerService: PositionLayerService) { }

  ngOnInit() {
    Notification.clearErrors();
    this.route.data.forEach((data: {positionLayer: PositionLayer}) => {
      this.positionLayer = data.positionLayer;
    });
  }

}
