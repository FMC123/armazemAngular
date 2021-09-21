import {Component, OnInit, OnDestroy} from '@angular/core';

import {ErrorHandler} from '../../shared/errors/error-handler';
import {Notification} from '../../shared/notification';
import {ContaminantService} from '../contaminant.service';
import {ContaminantFilter} from '../contaminant-filter';
import {Page} from '../../shared/page/page';
import {ModalManager} from '../../shared/modals/modal-manager';
import {Contaminant} from "../contaminant";
import {Search} from "../../shared/search/search";

@Component({
  selector: 'app-contaminant-list',
  templateUrl: './contaminant-list.component.html'
})
export class ContaminantListComponent implements OnInit, OnDestroy {
  loading: boolean;
  error: boolean;
  deleteConfirm: ModalManager = new ModalManager();
  deleteMessage;

  page: Page<Contaminant> = new Page<Contaminant>();
  showResults: boolean = false;
  resultsCollapsed: boolean = false;
  filter: ContaminantFilter = new ContaminantFilter();
  search: Search = new Search();


  constructor(private contaminantService: ContaminantService,
              private errorHandler: ErrorHandler) {
  }

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

  filterList(filter: ContaminantFilter) {
    this.filter = filter;
    this.loadList();
  }

  loadList() {
    this.error = false;
    this.loading = true;
    this.contaminantService.listPaged(this.search.value, this.page)
      .then(() => {
        this.showResults = true;
        this.resultsCollapsed = false;
        this.loading = false;
      })
      .catch(error => this.handleError(error));
  }

  beforeDelete(contaminant: Contaminant) {
    this.deleteMessage = 'Tem certeza que deseja excluir este registro?';
    this.deleteConfirm.open(contaminant.id);
  }

  delete(id: string | number) {
    this.contaminantService.delete(id)
      .then(() => {
        Notification.success('Contaminante Deletado!');
        this.loadList();
      })
      .catch(error => this.handleError(error));
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
