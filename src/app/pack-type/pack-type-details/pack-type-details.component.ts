import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Notification } from './../../shared/notification/notification';
import { PackType } from './../pack-type';

@Component({
  selector: 'app-pack-type-details',
  templateUrl: './pack-type-details.component.html'
})
export class PackTypeDetailsComponent implements OnInit {
  packType: PackType;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    Notification.clearErrors();
    this.route.data.forEach((data: {packType: PackType}) => {
      this.packType = data.packType;
    });
  }

}
