import { PackStockFilter } from './pack-stock-filter';
import { PackStockMovement } from '../pack-stock-movement';
import { Component, OnInit, OnDestroy }      from '@angular/core';

import { PackStockService } from './../pack-stock.service';
import { Notification } from './../../shared/notification/notification';
import { ErrorHandler, ModalManager, Search } from '../../shared/shared.module';
import { Logger } from '../../shared/logger/logger';
import { Page } from '../../shared/page/page';

@Component({
  selector: 'app-pack-stock-list',
  templateUrl: './pack-stock-list.component.html'
})
export class PackStockListComponent implements OnInit, OnDestroy {
  loading: boolean;
  error: boolean;
  deleteConfirm: ModalManager = new ModalManager();

  page: Page<PackStockMovement> = new Page<PackStockMovement>();
  filter = new PackStockFilter();

  constructor(
    private packStockService: PackStockService,
    private errorHandler: ErrorHandler,
    private logger: Logger
  ) {}

  ngOnInit() {
    Notification.clearErrors();
    this.loadList();

    this.page.changeQuery.subscribe(() => {
      this.loadList();
    });
  }

  filterList(filter: PackStockFilter) {
    this.filter = filter;
    this.loadList();
  }

  delete(id: string) {
    this.loading = true;

    this.packStockService.delete(id).then(() => {
      Notification.success('Movimentação excluída com sucesso!');
      return this.loadList();
    }).catch(error => this.handleError(error));
  }

  loadList() {
    this.error = false;
    this.loading = true;
    this.packStockService.listPaged(this.filter, this.page).then(() => {
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
