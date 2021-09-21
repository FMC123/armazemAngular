import {Component, OnInit, OnDestroy} from '@angular/core';

import {ErrorHandler} from '../../shared/errors/error-handler';
import {Notification} from '../../shared/notification';
import {SkuService} from '../sku.service';
import {SkuFilter} from '../sku-filter';
import {Page} from '../../shared/page/page';
import {ModalManager} from '../../shared/modals/modal-manager';
import {Sku} from "../sku";
import {Search} from "../../shared/search/search";

@Component({
  selector: 'app-sku-list',
  templateUrl: './sku-list.component.html'
})
export class SkuListComponent implements OnInit, OnDestroy {
  loading: boolean;
  error: boolean;
  deleteConfirm: ModalManager = new ModalManager();
  deleteMessage;

  page: Page<Sku> = new Page<Sku>();
  showResults: boolean = false;
  resultsCollapsed: boolean = false;
  filter: SkuFilter = new SkuFilter();
  search: Search = new Search();


  constructor(private skuService: SkuService,
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

  filterList(filter: SkuFilter) {
    this.filter = filter;
    this.loadList();
  }

  loadList() {
    this.error = false;
    this.loading = true;
    this.skuService.listPaged(this.search.value, this.page)
      .then(() => {
        this.showResults = true;
        this.resultsCollapsed = false;
        this.loading = false;
      })
      .catch(error => this.handleError(error));
  }

  beforeDelete(sku: Sku){
    this.skuService.hasChildren(sku.id).then( response => {
      this.deleteMessage = response ?
        'Ao excluir este registro, as referências em seus filhos serão perdidas! Tem certeza que deseja excluir este registro?' :
        'Tem certeza que deseja excluir este registro?';

      this.deleteConfirm.open(sku.id);
    }, err =>{
      this.deleteMessage = 'Tem certeza que deseja excluir este registro?';
    });
  }

  delete(id: string | number) {
    this.skuService.delete(id)
      .then(() => {
        Notification.success('SKU Deletado!');
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
