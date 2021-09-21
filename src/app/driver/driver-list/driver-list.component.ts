import { Component, OnInit, OnDestroy }      from '@angular/core';

import { Notification } from './../../shared/notification/notification';
import { ErrorHandler, ModalManager, Search } from '../../shared/shared.module';
import { Logger } from '../../shared/logger/logger';
import { Page } from '../../shared/page/page';
import {DriverService} from '../driver.service';
import {Driver} from '../driver';
import { Masks } from '../../shared/forms/masks/masks';
import {DateTimeHelper, NumberHelper} from "../../shared/globalization";

@Component({
  selector: 'driver-list',
  templateUrl: './driver-list.component.html'
})
export class DriverListComponent implements OnInit, OnDestroy {
  loading: boolean;
  error: boolean;
  deleteConfirm: ModalManager = new ModalManager();

  page: Page<Driver> = new Page<Driver>();
  search: Search = new Search();

  constructor(private DriverService: DriverService,
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
    this.DriverService.listPaged(this.search.value, this.page).then(() => {
    this.loading = false;
    }).catch(error => this.handleError(error));
  }

  delete(id: string | number) {
    this.DriverService.delete(id).then(() => {
      Notification.success('Transportadora excluída com sucesso!');
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

  formatDateNumber(date : number) {
    return date ? DateTimeHelper.toDDMMYYYY(date) : '-';
  }


  getDocumentFormatted(cpf: string) {
    return cpf.replace(
      /^(\d{3})(\d{3})(\d{3})(\d{2})/,
      '$1.$2.$3-$4'
    );
  }
}
