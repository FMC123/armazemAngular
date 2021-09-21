import { Component, OnInit, OnDestroy }      from '@angular/core';

import { Notification } from './../../shared/notification/notification';
import { ErrorHandler, ModalManager, Search } from '../../shared/shared.module';
import { Logger } from '../../shared/logger/logger';
import { Page } from '../../shared/page/page';
import {PositionLayerService} from "../position-layer.service";
import {PositionLayer} from "../position-layer";

@Component({
  selector: 'position-layer-list',
  templateUrl: './position-layer-list.component.html'
})
export class PositionLayerListComponent implements OnInit, OnDestroy {
  loading: boolean;
  error: boolean;
  deleteConfirm: ModalManager = new ModalManager();

  page: Page<PositionLayer> = new Page<PositionLayer>();
  search: Search = new Search();

  constructor(private positionLayerService:PositionLayerService,
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
    this.positionLayerService.listPaged(this.search.value, this.page).then(() => {
    this.loading = false;
    }).catch(error => this.handleError(error));
  }

  delete(id: string | number) {
    this.positionLayerService.delete(id).then(() => {
      Notification.success('Nave excluído com sucesso!');
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
