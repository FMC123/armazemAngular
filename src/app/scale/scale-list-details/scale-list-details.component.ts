import { ScaleService } from '../scale.service';

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Notification } from './../../shared/notification/notification';
import { Scale } from '../scale';

@Component({
  selector: 'app-scale-list-details',
  templateUrl: './scale-list-details.component.html'
})
export class ScaleDetailsComponent implements OnInit {
  scale: Scale;

  constructor(private route: ActivatedRoute,
              private scaleService: ScaleService) { }

  ngOnInit() {
    Notification.clearErrors();
    this.route.data.forEach((data: {scale: Scale}) => {
      this.scale = data.scale;
    });
  }

}
