import { ServiceGroupItemService } from '../service-group-item.service';
import { ServiceGroupItem } from '../service-group-item';
import { ServiceGroup } from '../../service-group/service-group';
import { ServiceGroupService } from '../../service-group/service-group.service';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Notification } from './../../shared/notification/notification';
import { ErrorHandler, ModalManager, Search } from '../../shared/shared.module';
import { Logger } from '../../shared/logger/logger';
import { Page } from '../../shared/page/page';

@Component({
  selector: 'app-service-group-item-list',
  templateUrl: './service-group-item-list.component.html'
})
export class ServiceGroupItemListComponent implements OnInit, OnDestroy {
  @Input() serviceGroup: ServiceGroup;

  loading: boolean;
  error: boolean;
  deleteConfirm: ModalManager = new ModalManager();

  page: Page<ServiceGroupItem> = new Page<ServiceGroupItem>();
  search: Search = new Search();

  get serviceGroupItems(): ServiceGroupItem[]{
    return this.page.data;
  }

  constructor(private serviceGroupItemService: ServiceGroupItemService,
              private errorHandler: ErrorHandler,
              private logger: Logger) {}

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
    this.serviceGroupItemService.listPaged(this.serviceGroup.id, this.search.value, this.page).then(() => {
      this.loading = false;
    }).catch(error => this.handleError(error));
  }

  delete(id: string | number) {
    this.serviceGroupItemService.delete(this.serviceGroup.id, id).then(() => {
      Notification.success('Item excluído com sucesso!');
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
