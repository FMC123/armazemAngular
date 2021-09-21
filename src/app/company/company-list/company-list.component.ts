import { Component, OnInit, OnDestroy }      from '@angular/core';
import { Notification } from './../../shared/notification/notification';
import { ErrorHandler, ModalManager, Search } from '../../shared/shared.module';
import { Logger } from '../../shared/logger/logger';
import { Page } from '../../shared/page/page';
import {CompanyService} from '../company.service';
import {Company} from '../company';

@Component({
  selector: 'app-company-list',
  templateUrl: './company-list.component.html'
})
export class CompanyListComponent implements OnInit, OnDestroy {
  loading: boolean;
  error: boolean;
  deleteConfirm: ModalManager = new ModalManager();
  formModal = new ModalManager();

  companySelected: Company;
  warehouseSelected = null;

  page: Page<Company> = new Page<Company>();
  search: Search = new Search();

  constructor(private companyService: CompanyService,
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
    this.companyService.listPaged(this.search.value, this.page).then(() => {
    this.loading = false;
    }).catch(error => this.handleError(error));
  }

  delete(id: string | number) {
    this.companyService.delete(id).then(() => {
      Notification.success('excluído com sucesso!');
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

  /**
   * Abre modal de informações do relatório
   * @param company
   */
  openEditHeaderReport(company) {
    this.companySelected = company;
    this.formModal.open(null);
  }

  /**
   * Fecha modal de informações do relatório
   */
  closeEditHeaderReport() {
    this.formModal.close();
  }
}