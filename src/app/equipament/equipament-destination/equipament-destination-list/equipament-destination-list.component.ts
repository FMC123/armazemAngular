import { Notification } from '../../../shared/notification';
import { AuthService } from '../../../auth/auth.service';
import { ErrorHandler } from '../../../shared/errors/error-handler';
import { Logger } from '../../../shared/logger/logger';
import { ModalManager } from '../../../shared/modals/modal-manager';
import { Page } from '../../../shared/page/page';
import { Equipament } from '../../equipament';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import {EquipamentDestination} from "../equipament-destination";
import {EquipamentDestinationService} from "../equipament-destination.service";

@Component({
  selector: 'app-equipament-destination-list',
  templateUrl: './equipament-destination-list.component.html'
})
export class EquipamentDestinationListComponent implements OnInit, OnDestroy {
  @Input() equipament: Equipament;
  logModal: ModalManager = new ModalManager();
  loading: boolean;
  error: boolean;
  page: Page<EquipamentDestination> = new Page<EquipamentDestination>();
  deleteConfirm: ModalManager = new ModalManager();

  constructor(
    private service: EquipamentDestinationService,
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
    this.service.delete(id).then(() => {
      Notification.success('Destino excluído com sucesso!');
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
