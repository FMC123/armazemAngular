import { Component, OnInit, OnDestroy }      from '@angular/core';

import { Logger } from './../../shared/logger/logger';
import { ErrorHandler } from './../../shared/errors/error-handler';
import { Notification } from './../../shared/notification/notification';
import { BatchLogService } from './../batch-log.service';
import { BatchLogFilter } from './../batch-log-filter';
import { BatchLog } from './../../batch-log/batch-log';
import { Page } from './../../shared/page/page';
import { ModalManager } from './../../shared/modals/modal-manager';

@Component({
  selector: 'app-batch-log-list',
  templateUrl: './batch-log-list.component.html'
})
export class BatchLogListComponent implements OnInit, OnDestroy {
  loading: boolean;
  error: boolean;
  deleteConfirm: ModalManager = new ModalManager();

  page: Page<BatchLog> = new Page<BatchLog>();
  showResults: boolean = false;
  filterCollapsed: boolean = false;
  resultsCollapsed: boolean = false;
  filter: BatchLogFilter = new BatchLogFilter();

  constructor(
    private batchLogService: BatchLogService,
    private errorHandler: ErrorHandler,
    private logger: Logger,
  ) {}

  ngOnInit() {
    Notification.clearErrors();
    this.page.setSort('createdDate', Page.SORT_DESC);
    this.page.changeQuery.subscribe(() => {
      this.loadList();
    });

    this.loadList();
  }

  filterList(filter: BatchLogFilter) {
    this.filter = filter;
    this.loadList().then(() => {
      this.filterCollapsed = true;
    });
  }

  loadList() {
    this.error = false;
    this.loading = true;
    return this.batchLogService.listPaged(this.filter, this.page).then(() => {
      this.showResults = true;
      this.resultsCollapsed = false;
      this.loading = false;
    }).catch(error => this.handleError(error));
  }

  ngOnDestroy() {
    this.page.changeQuery.unsubscribe();
  }

  handleError(error) {
    this.error = true;
    this.loading = false;
    return this.errorHandler.fromServer(error);
  }
}
