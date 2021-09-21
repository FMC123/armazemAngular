import { Component, OnInit, OnDestroy } from '@angular/core';

import { ClassificationService } from '../classification.service';
import { ClassificationVersion } from '../classification-version';
import { Notification } from '../../shared/notification';
import { ErrorHandler, ModalManager, Search } from '../../shared/shared.module';
import { Logger } from '../../shared/logger/logger';
import { Page } from '../../shared/page/page';

@Component({
  selector: 'app-classification-list',
  templateUrl: './classification-list.component.html'
})
export class ClassificationListComponent implements OnInit, OnDestroy {
  loading: boolean;
  error: boolean;
  deleteConfirm: ModalManager = new ModalManager();

  page: Page<ClassificationVersion> = new Page<ClassificationVersion>();
  search: Search = new Search();

  get classifications(): ClassificationVersion[] {
    return this.page.data;
  }

  constructor(
    private classificationService: ClassificationService,
    private errorHandler: ErrorHandler,
    private logger: Logger
  ) { }

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

  loadList() {
    this.error = false;
    this.loading = true;
    this.classificationService.listPaged(this.search.value, this.page).then(() => {
      this.loading = false;
    }).catch(error => this.handleError(error));
  }

  delete(id: string | number) {
    this.classificationService.delete(id).then(() => {
      Notification.success('Classificação excluída com sucesso!');
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
