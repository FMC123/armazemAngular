import { ModalManager } from '../../shared/modals/modal-manager';

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Notification } from './../../shared/notification/notification';
import {Stack} from "../stack";
import {StackService} from "../stack.service";

@Component({
  selector: 'app-stack-list-details',
  templateUrl: './stack-list-details.component.html'
})
export class StackDetailsComponent implements OnInit {
  stack: Stack;

  constructor(private route: ActivatedRoute,
              private stackService: StackService) { }

  ngOnInit() {
    Notification.clearErrors();
    this.route.data.forEach((data: {stack: Stack}) => {
      this.stack = data.stack;
    });
  }

}
