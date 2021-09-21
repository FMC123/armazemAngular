import { Notification } from '../../../shared/notification';
import { AuthService } from '../../../auth/auth.service';
import { ErrorHandler } from '../../../shared/errors/error-handler';
import { Logger } from '../../../shared/logger/logger';
import { ModalManager } from '../../../shared/modals/modal-manager';
import { Page } from '../../../shared/page/page';
import { Equipament } from '../../equipament';
import { EquipamentTag } from '../equipament-tag';
import { EquipamentTagService } from '../equipament-tag.service';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-equipament-tag-list',
  templateUrl: './equipament-tag-list.component.html'
})
export class EquipamentTagListComponent implements OnInit, OnDestroy {
  @Input() equipament: Equipament;
  logModal: ModalManager = new ModalManager();
  loading: boolean;
  error: boolean;
  page: Page<EquipamentTag> = new Page<EquipamentTag>();
  deleteConfirm: ModalManager = new ModalManager();

  constructor(
    private service: EquipamentTagService,
    private errorHandler: ErrorHandler,
    private logger: Logger,
    private auth: AuthService,
  ) {}

  ngOnInit() {
    this.loadList();
    this.page.changeQuery.subscribe(() => {
      this.loadList();
    });
  }

  delete(id: string | number) {
    this.service.delete(this.equipament.id,  id).then(() => {
      Notification.success('Tag excluída com sucesso!');
      this.loadList();
    }).catch(error => this.handleError(error));
  }

  loadList() {
    this.error = false;
    this.loading = true;
    return this.service.listPaged(this.equipament.id, this.page).then(() => {
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
