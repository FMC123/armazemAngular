import { ModalManager } from '../../shared/modals/modal-manager';

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Notification } from './../../shared/notification/notification';
import {BatchLog} from '../batch-log';
import {BatchLogService} from '../batch-log.service';

@Component({
  selector: 'app-batch-log-details',
  templateUrl: './batch-log-details.component.html'
})
export class BatchLogDetailsComponent implements OnInit {
  batchLog: BatchLog;

  constructor(private route: ActivatedRoute,
              private batchLogService: BatchLogService) { }

  ngOnInit() {
    Notification.clearErrors();
    this.route.data.forEach((data: {batchLog: BatchLog}) => {
      this.batchLog = data.batchLog;
    });
  }

}
