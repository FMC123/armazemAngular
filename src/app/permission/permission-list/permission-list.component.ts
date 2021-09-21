
import { Component, OnInit, OnDestroy }      from '@angular/core';

import { Notification } from './../../shared/notification/notification';
import { ErrorHandler, ModalManager, Search } from '../../shared/shared.module';
import { Logger } from '../../shared/logger/logger';
import { Page } from '../../shared/page/page';
import { DbGroup } from 'app/permission/dbGroup';
import { PermissionService } from 'app/permission/permission.service';

@Component({
  selector: 'app-permission-list',
  templateUrl: './permission-list.component.html'
})
export class PermissionListComponent implements OnInit, OnDestroy {
  loading: boolean;
  error: boolean;
  lista;
  deleteConfirm: ModalManager = new ModalManager();

  page: Page<DbGroup> = new Page<DbGroup>();

  constructor(
    private permissionService: PermissionService,
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

  delete(id: string) {
    this.loading = true;

    this.permissionService.delete(id).then(() => {
      Notification.success('Grupo excluído com sucesso!');
      return this.loadList();
    }).catch(error => this.handleError(error));
  }

  loadList() {
    this.error = false;
    this.loading = true;
    this.permissionService.list().then((e) => {
      this.loading = false;
      this.lista = e;
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
