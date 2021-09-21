import { Component, OnInit, OnDestroy }      from '@angular/core';

import { Logger } from './../../shared/logger/logger';
import { ErrorHandler } from './../../shared/errors/error-handler';
import { Notification } from './../../shared/notification/notification';
import { AccessTokenService } from './../access-token.service';
import { AccessTokenFilter } from './../access-token-filter';
import { AccessToken } from './../../auth/access-token';
import { Page } from './../../shared/page/page';
import { ModalManager } from './../../shared/modals/modal-manager';

@Component({
  selector: 'app-access-token-list',
  templateUrl: './access-token-list.component.html'
})
export class AccessTokenListComponent implements OnInit, OnDestroy {
  loading: boolean;
  error: boolean;
  deleteConfirm: ModalManager = new ModalManager();

  page: Page<AccessToken> = new Page<AccessToken>();
  showResults: boolean = false;
  filterCollapsed: boolean = false;
  resultsCollapsed: boolean = false;
  filter: AccessTokenFilter = new AccessTokenFilter();

  constructor(private accessTokenService: AccessTokenService,
              private errorHandler: ErrorHandler,
              private logger: Logger) {}

  ngOnInit() {
    Notification.clearErrors();
    this.loadList();
    this.page.setSort('deletedDate', Page.SORT_DESC);
    this.page.changeQuery.subscribe(() => {
      this.loadList();
    });
  }

  filterList(filter: AccessTokenFilter) {
    this.filter = filter;
    this.loadList().then(() => {
      this.filterCollapsed = true;
    });
  }

  loadList() {
    this.error = false;
    this.loading = true;
    return this.accessTokenService.listPaged(this.filter, this.page).then(() => {
      this.showResults = true;
      this.resultsCollapsed = false;
      this.loading = false;
    }).catch(error => this.handleError(error));
  }

  delete(id: string | number) {
    this.accessTokenService.delete(id).then(() => {
      Notification.success('Usuário desconectado com sucesso!');
      this.loadList();
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
