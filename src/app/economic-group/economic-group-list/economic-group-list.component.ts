import { Component, OnInit, OnDestroy }      from '@angular/core';
import { Notification } from './../../shared/notification/notification';
import { ErrorHandler, ModalManager, Search } from '../../shared/shared.module';
import { Logger } from '../../shared/logger/logger';
import { Page } from '../../shared/page/page';
import {EconomicGroupService} from '../economic-group.service';
import {EconomicGroup} from '../economic-group';

@Component({
  selector: 'app-economic-group-list',
  templateUrl: './economic-group-list.component.html'
})
export class EconomicGroupListComponent implements OnInit, OnDestroy {
  loading: boolean;
  error: boolean;
  deleteConfirm: ModalManager = new ModalManager();

  page: Page<EconomicGroup> = new Page<EconomicGroup>();
  search: Search = new Search();

  constructor(private economicGroupService: EconomicGroupService,
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
    this.economicGroupService.listPaged(this.search.value, this.page).then(() => {
    this.loading = false;
    }).catch(error => this.handleError(error));
  }

  delete(id: string | number) {
    this.economicGroupService.delete(id).then(() => {
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
}
