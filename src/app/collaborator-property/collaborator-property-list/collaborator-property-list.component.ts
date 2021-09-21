import { Component, OnInit, OnDestroy }      from '@angular/core';

import { Notification } from './../../shared/notification/notification';
import { ErrorHandler, ModalManager, Search } from '../../shared/shared.module';
import { Logger } from '../../shared/logger/logger';
import { Page } from '../../shared/page/page';
import {CollaboratorProperty} from "../collaborator-property";
import {CollaboratorPropertyService} from "../collaborator-property.service";

@Component({
    selector: 'app-collaborator-property-list',
    templateUrl: './collaborator-property-list.component.html'
  })

export class CollaboratorPropertyListComponent implements OnInit, OnDestroy {
  loading: boolean;
  error: boolean;
  deleteConfirm: ModalManager = new ModalManager();

  page: Page<CollaboratorProperty> = new Page<CollaboratorProperty>();
  search: Search = new Search();

  constructor(private collaboratorPropertyService: CollaboratorPropertyService,
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
    this.collaboratorPropertyService.listPaged(this.search.value, this.page).then(() => {
      this.loading = false;
    }).catch(error => this.handleError(error));
  }

  delete(id: string | number) {
    this.collaboratorPropertyService.delete(id).then(() => {
      Notification.success('Registro excluído com sucesso!');
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
