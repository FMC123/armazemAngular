import { IntegrationLogFilter } from '../integration-log.filter';
import { ModalManager } from '../../../../shared/modals/modal-manager';
import { Search } from '../../../../shared/search/search';
import { IntegrationLog } from '../integration-log';
import { FunctionLogService } from '../integration-log.service';
import { ErrorHandler } from '../../../../shared/errors/error-handler';
import { Page } from '../../../../shared/page/page';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-function-log-ax-list',
  templateUrl: './integration-log-list.component.html'
})
export class IntegrationLogListComponent implements OnInit {
  loading: boolean;
  error: boolean;
  showResults: boolean = false;
  page: Page<IntegrationLog> = new Page<IntegrationLog>();
  filter = new IntegrationLogFilter();
  filterCollapsed: boolean = false;
  resultsCollapsed: boolean = false;
  search: Search = new Search();
  resendConfirm: ModalManager = new ModalManager();

  constructor(
    private functionLogService: FunctionLogService,
    private errorHandler: ErrorHandler,
  ) {}

  filterList(filter: IntegrationLogFilter) {
    this.filter = filter;
    this.loadList().then(() => {
      this.filterCollapsed = true;
    });
  }

  ngOnInit() {
    this.loadList();
    this.page.changeQuery.subscribe(() => {
      this.loadList();
    });
  }

  loadList() {
    this.loading = true;
    this.error = false;
    return this.functionLogService.listPaged(this.filter, this.page).then(() => {
      this.loading = false;
      this.showResults = true;
      this.resultsCollapsed = false;
    }).catch(error => this.handleError(error));
  }

  ngOnDestroy() {
    this.page.changeQuery.unsubscribe();
  }

  resend(id) {
    this.loading = true;
    this.functionLogService.resend(id).then(() => {
      return this.loadList();
    }).catch(error => this.handleError(error));
  }

  handleError(error) {
    this.loading = false;
    this.error = true;
    return this.errorHandler.fromServer(error);
  }
}
