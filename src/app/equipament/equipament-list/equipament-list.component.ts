import { Component, OnInit, OnDestroy }      from '@angular/core';

import { EquipamentService } from './../equipament.service';
import { Equipament } from './../equipament';
import { Notification } from './../../shared/notification/notification';
import { ErrorHandler, ModalManager, Search } from '../../shared/shared.module';
import { Logger } from '../../shared/logger/logger';
import { Page } from '../../shared/page/page';

@Component({
  selector: 'app-equipament-list',
  templateUrl: './equipament-list.component.html'
})
export class EquipamentListComponent implements OnInit, OnDestroy {
  loading: boolean;
  error: boolean;
  deleteConfirm: ModalManager = new ModalManager();

  page: Page<Equipament> = new Page<Equipament>();
  search: Search = new Search();

  get equipaments(): Equipament[]{
    return this.page.data;
  }

  constructor(
    private equipamentService: EquipamentService,
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
    this.equipamentService.listPaged(this.search.value, this.page).then(() => {
      this.loading = false;
    }).catch(error => this.handleError(error));
  }

  delete(id: string | number) {
    this.equipamentService.delete(id).then(() => {
      Notification.success('Equipamento excluído com sucesso!');
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
