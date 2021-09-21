import { Component, OnInit, OnDestroy }      from '@angular/core';

import { WarehouseStakeholderService } from './../warehouse-stakeholder.service';
import { WarehouseStakeholder } from './../warehouse-stakeholder';
import { Notification } from './../../shared/notification/notification';
import { ErrorHandler, ModalManager, Search } from '../../shared/shared.module';
import { Logger } from '../../shared/logger/logger';
import { Page } from '../../shared/page/page';

@Component({
  selector: 'app-warehouse-stakeholder-list',
  templateUrl: './warehouse-stakeholder-list.component.html'
})
export class WarehouseStakeholderListComponent implements OnInit, OnDestroy {
  loading: boolean;
  error: boolean;
  deleteConfirm: ModalManager = new ModalManager();

  page: Page<WarehouseStakeholder> = new Page<WarehouseStakeholder>();
  searchName: Search = new Search();
  searchTradingName: Search = new Search();
  searchDocument: Search = new Search();

  constructor(private warehouseStakeholderService: WarehouseStakeholderService,
              private errorHandler: ErrorHandler,
              private logger: Logger) {}

  ngOnInit() {
    this.loadList();
    this.page.changeQuery.subscribe(() => {
      this.loadList();
    });
    this.searchName
        .subscribe(() => {
          this.loadList();
        });
    this.searchTradingName
        .subscribe(() => {
          this.loadList();
        });
    this.searchDocument
        .subscribe(() => {
          this.loadList();
        });
  }

  loadList() {
    this.error = false;
    this.loading = true;
    this.warehouseStakeholderService.listPaged(this.searchName.value, this.searchTradingName.value,
      this.searchDocument.value, this.page).then(() => {
      this.loading = false;
    }).catch(error => this.handleError(error));
  }

  delete(id: string | number) {
    this.warehouseStakeholderService.delete(id).then(() => {
      Notification.success('Excluído com sucesso!');
      this.loadList();
    }).catch(error => this.handleError(error));
  }

  ngOnDestroy() {
    this.page.changeQuery.unsubscribe();
    this.searchName.destroy();
    this.searchTradingName.destroy();
    this.searchDocument.destroy();
  }

  handleError(error){
    this.error = true;
    this.loading = false;
    return this.errorHandler.fromServer(error);
  }
}
