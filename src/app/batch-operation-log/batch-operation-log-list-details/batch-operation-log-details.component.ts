import { ModalManager } from '../../shared/modals/modal-manager';

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Notification } from './../../shared/notification/notification';
import {BatchOperationLog} from '../batch-operation-log';
import {BatchOperationLogService} from '../batch-operation-log.service';

@Component({
  selector: 'app-batch-operation-log-details',
  templateUrl: './batch-operation-log-details.component.html'
})
export class BatchOperationLogDetailsComponent implements OnInit {
  batchOperationLog: BatchOperationLog;

  constructor(
    private route: ActivatedRoute,
    private batchLogService: BatchOperationLogService
  ) { }

  ngOnInit() {
    Notification.clearErrors();
    this.route.data.forEach((data: {batchOperationLog: BatchOperationLog}) => {
      this.batchOperationLog = data.batchOperationLog;
    });
  }

}
