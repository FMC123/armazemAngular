import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Notification } from './../../shared/notification/notification';
import { OperationType } from './../operation-type';

@Component({
  selector: 'app-operation-type-details',
  templateUrl: './operation-type-details.component.html'
})
export class OperationTypeDetailsComponent implements OnInit {
  operationType: OperationType;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    Notification.clearErrors();
    this.route.data.forEach((data: {operationType: OperationType}) => {
      this.operationType = data.operationType;
    });
  }

}
