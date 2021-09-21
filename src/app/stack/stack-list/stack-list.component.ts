import { ModalManager } from '../../shared/modals/modal-manager';
import { Component, OnInit, Input } from '@angular/core';

import { Logger } from './../../shared/logger/logger';
import { ErrorHandler } from './../../shared/errors/error-handler';

import { Page } from './../../shared/page/page';

import {Search} from "../../shared/search/search";
import {Notification} from "../../shared/notification/notification";
import {Stack} from "../stack";
import {StackService} from "../stack.service";
import {Position} from "../../position/position";

@Component({
  selector: 'app-stack-list',
  templateUrl: './stack-list.component.html'
})
export class StackListComponent implements OnInit {
  @Input() position: Position;

  logModal: ModalManager = new ModalManager();

  loading: boolean;
  error: boolean;
  deleteConfirm: ModalManager = new ModalManager();
  page: Page<Stack> = new Page<Stack>();
  search: Search = new Search();
  constructor(private service: StackService,
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
    return this.service.listPaged(this.position.id, this.search.value , this.page).then(() => {
      this.loading = false;
    }).catch(error => this.handleError(error));
  }

  delete(stackId: string | number) {
    this.service.delete(stackId).then(() => {
      Notification.success('Pilha excluída com sucesso!');
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
}
