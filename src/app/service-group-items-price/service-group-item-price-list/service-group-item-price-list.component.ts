import { ServiceGroupItem } from '../../service-group-items/service-group-item';
import { ServiceGroupItemPriceService } from '../service-group-item-price.service';
import { ServiceGroupItemPrice } from '../service-group-item-price';
import { ServiceGroup } from '../../service-group/service-group';
import { ServiceGroupService } from '../../service-group/service-group.service';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Notification } from './../../shared/notification/notification';
import { ErrorHandler, ModalManager, Search } from '../../shared/shared.module';
import { Logger } from '../../shared/logger/logger';
import { Page } from '../../shared/page/page';

@Component({
  selector: 'app-service-group-item-price-list',
  templateUrl: './service-group-item-price-list.component.html'
})
export class ServiceGroupItemPriceListComponent implements OnInit, OnDestroy {
  @Input() serviceGroupItem: ServiceGroupItem;

  loading: boolean;
  error: boolean;
  deleteConfirm: ModalManager = new ModalManager();

  page: Page<ServiceGroupItemPrice> = new Page<ServiceGroupItemPrice>();
  search: Search = new Search();

  get serviceGroupItemPrice(): ServiceGroupItemPrice[]{
    return this.page.data;
  }

  constructor(private serviceGroupItemPriceService: ServiceGroupItemPriceService,
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
    this.serviceGroupItemPriceService.listPaged(this.serviceGroupItem.id, this.search.value, this.page).then(() => {
      this.loading = false;
    }).catch(error => this.handleError(error));
  }

  delete(id: string | number) {
    this.serviceGroupItemPriceService.delete(this.serviceGroupItem.id, id).then(() => {
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
