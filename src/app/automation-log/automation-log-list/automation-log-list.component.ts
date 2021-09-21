import { Component, OnInit, OnDestroy }      from '@angular/core';
import { AutomationLogService } from './../automation-log.service';
import { AutomationLog } from './../automation-log';
import { Notification } from './../../shared/notification/notification';
import { ErrorHandler, ModalManager, Search } from '../../shared/shared.module';
import { Logger } from '../../shared/logger/logger';
import { Page } from '../../shared/page/page';

@Component({
  selector: 'app-automation-log-list',
  templateUrl: './automation-log-list.component.html'
})
export class AutomationLogListComponent implements OnInit, OnDestroy {
  loading: boolean;
  error: boolean;

  page: Page<AutomationLog> = new Page<AutomationLog>();
  search: Search = new Search();

  get automationLogs(): AutomationLog[]{
    return this.page.data;
  }

  constructor(
    private automationLogService: AutomationLogService,
    private errorHandler: ErrorHandler,
    private logger: Logger
  ) {}

  ngOnInit() {
    Notification.clearErrors();
    this.loadList();
    this.page.changeQuery.subscribe(() => {
      this.loadList();
    });
    this.search.subscribe(() => {
      this.loadList();
    });
  }

  loadList() {
    this.error = false;
    this.loading = true;
    this.automationLogService.listPaged(this.search.value, this.page).then(() => {
      this.loading = false;
    }).catch(error => this.handleError(error));
  }

  ngOnDestroy() {
    this.page.changeQuery.unsubscribe();
    this.search.destroy();
  }

  handleError(error) {
    this.error = true;
    this.loading = false;
    return this.errorHandler.fromServer(error);
  }
}
