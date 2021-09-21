import { BatchOperationLogService } from '../batch-operation-log.service';
import { BatchOperationLog } from '../batch-operation-log';
import { BatchOperationType } from '../../batch-operation/batch-operation-type';
import { Notification } from '../../shared/notification';
import { ErrorHandler } from '../../shared/errors/error-handler';
import { Logger } from '../../shared/logger/logger';
import { Router } from '@angular/router';
import { BatchOperationService } from '../../batch-operation/batch-operation.service';
import { BatchOperationFilter } from '../../batch-operation/batch-operation-list/batch-operation-filter';
import { ModalManager } from '../../shared/modals/modal-manager';
import { BatchOperation } from '../../batch-operation/batch-operation';
import { Observable, Subscription } from 'rxjs/Rx';
import { Page } from '../../shared/page/page';
import { Component, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-batch-operation-log-list',
  templateUrl: 'batch-operation-log-list.component.html'
})

export class BatchOperationLogListComponent implements OnInit, OnDestroy {
  loading: boolean;
  error: boolean;
  page: Page<BatchOperationLog> = new Page<BatchOperationLog>();
  refresherSubscription: Subscription;
  filter = new BatchOperationFilter();
  deleteConfirm = new ModalManager();
  types = BatchOperationType.list();

  constructor(
    private service: BatchOperationLogService,
    private errorHandler: ErrorHandler,
    private router: Router,
    private logger: Logger,
  ) {}

  ngOnInit() {
    Notification.clearErrors();
    this.loadList();
    this.page.changeQuery.subscribe(() => {
      this.loadList();
    });
    this.setupAutoRefresher();
  }

  ngOnDestroy() {
    if (this.refresherSubscription && !this.refresherSubscription.closed) {
      this.refresherSubscription.unsubscribe();
    }

    this.refresherSubscription = null;

    this.page.changeQuery.unsubscribe();
  }

  setupAutoRefresher() {
    this.refresherSubscription = Observable.timer(5000, 5000).subscribe(() => {
      this.loadList(true);
    });
  }

  filterList(filter) {
    this.filter = filter;
    this.loadList();
  }

  loadList(
    skipLoading = false,
  ) {
    this.error = false;

    if (!skipLoading) {
      this.loading = true;
    }

    this.service
      .listPaged(this.filter, this.page)
      .then(() => {
        this.loading = false;
      }).catch(error => this.handleError(error));
  }

  handleError(error) {
    this.error = true;
    this.loading = false;
    return this.errorHandler.fromServer(error);
  }
}
