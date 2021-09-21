import { Component, OnInit, OnDestroy } from '@angular/core';

import { WarehouseService } from './../warehouse.service';
import { Warehouse } from './../warehouse';
import { Notification } from './../../shared/notification/notification';
import { ErrorHandler, ModalManager, Search } from '../../shared/shared.module';
import { Logger } from '../../shared/logger/logger';
import { Page } from '../../shared/page/page';
import { Company } from 'app/company/company';
import { AuthService } from 'app/auth/auth.service';

@Component({
  selector: 'app-warehouse-list',
  templateUrl: './warehouse-list.component.html'
})
export class WarehouseListComponent implements OnInit, OnDestroy {
  loading: boolean;
  error: boolean;
  deleteConfirm: ModalManager = new ModalManager();

  page: Page<Warehouse> = new Page<Warehouse>();
  search: Search = new Search();

  formModal = new ModalManager();
  companySelected: Company;
  warehouseSelected = Warehouse;

  constructor(private warehouseService: WarehouseService,
    private errorHandler: ErrorHandler,
    private auth: AuthService) { }

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
    this.warehouseService.listPaged(this.search.value, this.page).then(() => {
      this.loading = false;
    }).catch(error => this.handleError(error));
  }

  delete(id: string | number) {
    this.warehouseService.delete(id).then(() => {
      Notification.success('Armazém excluído com sucesso!');
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

  /**
   * Abre modal de informações do relatório
   * @param warehouse
   */
  openEditHeaderReport(warehouse) {

    if (this.auth.accessToken != null && this.auth.accessToken.user != null) {
      this.companySelected = this.auth.accessToken.user.company;
    }
    
    this.warehouseSelected = warehouse;
    this.formModal.open(null);
  }

  /**
   * Fecha modal de informações do relatório
   */
  closeEditHeaderReport() {
    this.formModal.close();
  }
}