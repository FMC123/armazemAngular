import { Component, OnInit, OnDestroy, Input }      from '@angular/core';

import { Page } from '../../shared/page/page';
import { ErrorHandler, ModalManager, Search } from '../../shared/shared.module';
import { WarehouseStakeholder } from '../../warehouse-stakeholder/warehouse-stakeholder';
import { Farm } from '../farm';
import { Notification } from './../../shared/notification/notification';
import { Logger } from '../../shared/logger/logger';
import {FarmService} from '../farm.service';

@Component({
  selector: 'app-farm-list',
  templateUrl: './farm-list.component.html'
})
export class FarmListComponent implements OnInit, OnDestroy {

  loading: boolean;
  error: boolean;
  deleteConfirm: ModalManager = new ModalManager();

  page: Page<Farm> = new Page<Farm>();
  search: Search = new Search();

  constructor(private farmService: FarmService,
              private errorHandler: ErrorHandler,
              private logger: Logger) {}

  ngOnInit() {
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
    this.farmService.listPaged(this.search.value, this.page).then(() => {
    this.loading = false;
    }).catch(error => this.handleError(error));
  }

  delete(id: string | number) {
    this.farmService.delete(id).then(() => {
      Notification.success('Fazenda excluído com sucesso!');
      this.loadList();
    }).catch(error => this.handleError(error));
  }

  ngOnDestroy() {
    this.page.changeQuery.unsubscribe();
    this.search.destroy();
  }

  handleError(error){
    this.error = true;
    this.loading = false;
    return this.errorHandler.fromServer(error);
  }
}
