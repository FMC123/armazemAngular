import { Component, OnInit, OnDestroy } from '@angular/core';

import { ForkliftService } from '../forklift.service';
import { Forklift } from '../forklift';
import { Notification } from '../../shared/notification';
import { ErrorHandler, ModalManager, Search } from '../../shared/shared.module';
import { Logger } from '../../shared/logger/logger';
import { Page } from '../../shared/page/page';
import {AuthService} from "../../auth/auth.service";

@Component({
  selector: 'forklift-list',
  templateUrl: './forklift-list.component.html'
})
export class ForkliftListComponent implements OnInit, OnDestroy {
  loading: boolean;
  error: boolean;
  warehouseId: string;

  deleteConfirm: ModalManager = new ModalManager();

  page: Page<Forklift> = new Page<Forklift>();
  search: Search = new Search();

  get forklifts(): Forklift[]{
    return this.page.data;
  }

  constructor(private forkliftService: ForkliftService,
              private errorHandler: ErrorHandler,
              private logger: Logger,
              private loggedUser: AuthService) {}

  ngOnInit() {
    this.warehouseId = this.loggedUser.accessToken.warehouse.id;
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
    this.forkliftService.listPaged(this.search.value, this.page).then(() => {
      this.loading = false;
    }).catch(error => this.handleError(error));
  }

  changeForkliftActivationStatus (forklift: Forklift) {

    if(!forklift.inUse){
      this.forkliftService.changeForkliftActivationStatus(forklift).then(() =>
      {
        Notification.success('Estado da empilhadeira alterado!');
        this.loadList();
      }).catch(error => this.handleError(error));
    } else {
      Notification.error('Empilhadeira em uso, não pode ter o estado alterado!');
    }
  }

  delete(id: string | number) {
    this.forkliftService.delete(id).then(() => {
      Notification.success('Empilhadeira excluída com sucesso!');
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
