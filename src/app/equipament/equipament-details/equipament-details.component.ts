import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Notification } from './../../shared/notification/notification';
import { Equipament } from './../equipament';

@Component({
  selector: 'app-equipament-details',
  templateUrl: './equipament-details.component.html'
})
export class EquipamentDetailsComponent implements OnInit {
  equipament: Equipament;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    Notification.clearErrors();
    this.route.data.forEach((data: {equipament: Equipament}) => {
      this.equipament = data.equipament;
    });
  }

}
