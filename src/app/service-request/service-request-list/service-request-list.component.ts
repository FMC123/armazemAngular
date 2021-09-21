import { Component, OnInit, OnDestroy } from '@angular/core';

import { ServiceRequestService } from './../service-request.service';
import { ServiceRequest } from './../service-request';
import { Notification } from './../../shared/notification/notification';
import { ErrorHandler, ModalManager, Search } from '../../shared/shared.module';
import { Logger } from '../../shared/logger/logger';
import { Page } from '../../shared/page/page';
import { ServiceRequestListFilter } from './service-request-list-filter';


@Component({
  selector: 'app-service-request-list',
  templateUrl: './service-request-list.component.html'
})
export class ServiceRequestListComponent implements OnInit, OnDestroy {
  loading: boolean;
  error: boolean;
  page: Page<ServiceRequest> = new Page<ServiceRequest>();
  filter: ServiceRequestListFilter = new ServiceRequestListFilter();

  get serviceRequests(): ServiceRequest[] {
    return this.page.data;
  }

  constructor(
    private serviceRequestService: ServiceRequestService,
    private errorHandler: ErrorHandler,
    private logger: Logger
  ) { }

  ngOnInit() {
    Notification.clearErrors();
    this.loadList();

    this.page.changeQuery.subscribe(() => {
      this.loadList();
    });

    //    this.filter
    //      .subscribe(() => {
    //        this.loadList();
    //     });
  }

  filterList(filter) {
    this.filter = filter;
    this.loadList();
  }

  loadList() {
    this.error = false;
    this.loading = true;
    this.serviceRequestService.listPaged(this.filter, this.page).then(() => {
      this.loading = false;
    }).catch(error => this.handleError(error));
  }

  delete(id: string | number) {
    this.serviceRequestService.delete(id).then(() => {
      Notification.success('Embalagem excluída com sucesso!');
      this.loadList();
    }).catch(error => this.handleError(error));
  }

  ngOnDestroy() {
    this.page.changeQuery.unsubscribe();
    //this.filter.destroy();
  }

  handleError(error) {
    this.error = true;
    this.loading = false;
    return this.errorHandler.fromServer(error);
  }
}
