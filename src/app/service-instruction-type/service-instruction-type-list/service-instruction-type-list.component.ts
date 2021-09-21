import { Component, OnInit, OnDestroy } from '@angular/core';

import { ServiceInstructionTypeService } from './../service-instruction-type.service';
import { ServiceInstructionType } from './../service-instruction-type';
import { Notification } from './../../shared/notification/notification';
import { ErrorHandler, ModalManager, Search } from '../../shared/shared.module';
import { Logger } from '../../shared/logger/logger';
import { Page } from '../../shared/page/page';

@Component({
  selector: 'app-service-instruction-type-list',
  templateUrl: './service-instruction-type-list.component.html'
})
export class ServiceInstructionTypeListComponent implements OnInit, OnDestroy {
  loading: boolean;
  error: boolean;
  deleteConfirm: ModalManager = new ModalManager();

  page: Page<ServiceInstructionType> = new Page<ServiceInstructionType>();
  search: Search = new Search();

  get serviceInstructionTypes(): ServiceInstructionType[] {
    return this.page.data;
  }

  constructor(
    private serviceInstructionTypeService: ServiceInstructionTypeService,
    private errorHandler: ErrorHandler,
    private logger: Logger
  ) { }

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
    this.serviceInstructionTypeService.listPaged(this.search.value, this.page).then(() => {
      this.loading = false;
    }).catch(error => this.handleError(error));
  }

  delete(id: string | number) {
    this.serviceInstructionTypeService.delete(id).then(() => {
      Notification.success('Tipo de instrução de serviço excluída com sucesso!');
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
