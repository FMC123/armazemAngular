import { Component, OnInit, OnDestroy } from '@angular/core';

import { PurchaseProspectService } from './../purchase-prospect.service';
import { PurchaseProspect } from './../purchase-prospect';
import { Notification } from './../../shared/notification/notification';
import { ErrorHandler, ModalManager, Search } from '../../shared/shared.module';
import { Logger } from '../../shared/logger/logger';
import { Page } from '../../shared/page/page';
import { PurchaseProspectListFilter } from './purchase-prospect-list-filter'

@Component({
  selector: 'app-purchase-prospect-list',
  templateUrl: './purchase-prospect-list.component.html'
})
export class PurchaseProspectListComponent implements OnInit, OnDestroy {
  loading: boolean;
  error: boolean;
  // errorHandler: ErrorHandler;
  deleteConfirm: ModalManager = new ModalManager();
  page: Page<PurchaseProspect> = new Page<PurchaseProspect>();
  filter: PurchaseProspectListFilter = new PurchaseProspectListFilter();

  get purchaseProspects(): PurchaseProspect[] {
    return this.page.data;
  }

  constructor(
    private purchaseProspectService: PurchaseProspectService,
    private errorHandler: ErrorHandler,
    private logger: Logger
  ) { }

  ngOnInit() {
    Notification.clearErrors();
    this.loadList();

    this.page.changeQuery.subscribe(() => {
      this.loadList();
    });

    //    this.filter
    //      .subscribe(() => {
    //        this.loadList();
    //      });
  }

  filterList(filter) {
    this.filter = filter;
    this.loadList();
  }

  loadList() {
    this.error = false;
    this.loading = true;
    this.purchaseProspectService.listPaged(this.filter, this.page).then(() => {
      this.loading = false;
    }).catch(error => this.handleError(error));
  }

  delete(id: string | number) {
    this.purchaseProspectService.delete(id).then(() => {
      Notification.success('Prospecto de compra excluído com sucesso!');
      this.loadList();
    }).catch(error => this.handleError(error));
  }

  ngOnDestroy() {
    this.page.changeQuery.unsubscribe();
    //this.filter.destroy();
  }

  handleError(error) {
    this.error = true;
    this.loading = false;
    return this.errorHandler.fromServer(error);
  }
}
