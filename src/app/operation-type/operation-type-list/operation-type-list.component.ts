import { Component, OnInit, OnDestroy }      from '@angular/core';

import { OperationTypeService } from './../operation-type.service';
import { OperationType } from './../operation-type';
import { Notification } from './../../shared/notification/notification';
import { ErrorHandler, ModalManager, Search } from '../../shared/shared.module';
import { Logger } from '../../shared/logger/logger';
import { Page } from '../../shared/page/page';

@Component({
  selector: 'app-operation-type-list',
  templateUrl: './operation-type-list.component.html'
})
export class OperationTypeListComponent implements OnInit, OnDestroy {
  loading: boolean;
  error: boolean;
  deleteConfirm: ModalManager = new ModalManager();

  page: Page<OperationType> = new Page<OperationType>();
  search: Search = new Search();

  get operationTypes(): OperationType[]{
    return this.page.data;
  }

  constructor(
    private operationTypeService: OperationTypeService,
    private errorHandler: ErrorHandler,
    private logger: Logger
  ) {}

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
    this.operationTypeService.listPaged(this.search.value, this.page).then(() => {
      this.loading = false;
    }).catch(error => this.handleError(error));
  }

  delete(id: string | number) {
    this.operationTypeService.delete(id).then(() => {
      Notification.success('Tipo de Operação excluído com sucesso!');
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
