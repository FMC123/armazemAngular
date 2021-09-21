import { TransportationStatus } from '../transportation-status';
import { TransportationFilter } from '../transportation-filter';
import { Notification } from '../../shared/notification';
import { Logger } from '../../shared/logger/logger';
import { Router } from '@angular/router';
import { ErrorHandler } from '../../shared/errors/error-handler';
import { TransportationService } from '../transportation.service';
import { Page } from '../../shared/page/page';
import { Focusable } from '../../shared/forms/focusable/focusable.directive';
import { Transportation } from '../transportation';
import { Component, EventEmitter, OnDestroy, OnInit, Output, ViewChildren } from '@angular/core';

@Component({
  selector: 'app-transportation-list-select-modal',
  templateUrl: 'transportation-list-select-modal.component.html'
})

export class TransportationListSelectModalComponent implements OnInit,  OnDestroy {
  @Output() close: EventEmitter<void> = new EventEmitter<void>(false);
  @Output() select: EventEmitter<Transportation> = new EventEmitter<Transportation>(false);
  loading: boolean;
  error: boolean;
  page: Page<Transportation> = new Page<Transportation>();

  constructor(
    private transportationService: TransportationService,
    private errorHandler: ErrorHandler,
    private logger: Logger,
    private router: Router,
  ) {}

  ngOnInit() {
    Notification.clearErrors();
    this.loadList();
    this.page.changeQuery.subscribe(() => {
      this.loadList();
    });
  }

  ngOnDestroy() {
    this.page.changeQuery.unsubscribe();
  }

  onSelect(transportation: Transportation) {
    this.select.emit(transportation);
    (<any>jQuery)('.modal').modal('hide');
  }

  loadList() {
    this.error = false;
    this.loading = true;

    const filter = new TransportationFilter();
    filter.status = TransportationStatus.AGUARDANDO_ENTRADA.code;

    this.transportationService
      .listPaged(filter, this.page)
      .then(() => {
        this.loading = false;
      }).catch(error => this.handleError(error));
  }

  handleError(error) {
    this.error = true;
    this.loading = false;
    return this.errorHandler.fromServer(error);
  }

}
