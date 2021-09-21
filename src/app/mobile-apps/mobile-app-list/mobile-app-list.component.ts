import { Component, OnDestroy, OnInit } from '@angular/core';
import { MobileApp } from 'app/mobile-apps/mobile-app';
import { MobileAppService } from 'app/mobile-apps/mobile-app.service';

import { Logger } from '../../shared/logger/logger';
import { Page } from '../../shared/page/page';
import { ErrorHandler, ModalManager, Search } from '../../shared/shared.module';
import { Notification } from './../../shared/notification/notification';

@Component({
  selector: 'app-mobile-app-list',
  templateUrl: './mobile-app-list.component.html'
})
export class MobileAppListComponent implements OnInit, OnDestroy {
  loading: boolean;
  error: boolean;
  deleteConfirm: ModalManager = new ModalManager();

  page: Page<MobileApp> = new Page<MobileApp>();
  search: Search = new Search();

  get certificates(): MobileApp[] {
    return this.page.data;
  }

  constructor(private mobileAppService: MobileAppService,
    private errorHandler: ErrorHandler,
    private logger: Logger) { }

  ngOnInit() {
    Notification.clearErrors();
    this.loadList();
    this.page.changeQuery.subscribe(() => {
      this.loadList();
    });
    this.search
      .subscribe(() => {
        this.loadList();
      });
  }

  loadList() {
    this.error = false;
    this.loading = true;
    this.mobileAppService.listPaged(this.search.value, this.page).then(() => {
      this.loading = false;
    }).catch(error => this.handleError(error));
  }

  delete(id: string | number) {
    this.mobileAppService.delete(id).then(() => {
      Notification.success('Aplicativo mobile excluído com sucesso!');
      this.loadList();
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
