import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { errorHandler } from '@angular/platform-browser/src/browser';
import { Router } from '@angular/router';

import { ErrorHandler } from '../../../shared/errors/error-handler';
import { Logger } from '../../../shared/logger/logger';
import { Notification } from '../../../shared/notification';
import { Page } from '../../../shared/page/page';
import { ShippingAuthorization } from '../../../shipping-authorization/shipping-authorization';
import { ShippingAuthorizationService } from '../../../shipping-authorization/shipping-authorization.service';
import { Transportation } from '../../../transportation/transportation';

@Component({
  selector: 'app-transportation-shipping-authorization-modal',
  templateUrl: './transportation-shipping-authorization-modal.component.html'
})
export class TransportationShippingAuthorizationModalComponent implements OnInit, OnDestroy {
  @Output() close: EventEmitter<void> = new EventEmitter<void>(false);
  @Input() transportation: Transportation;
  loading: boolean;
  error: boolean;
  page: Page<ShippingAuthorization> = new Page<ShippingAuthorization>();

  constructor(
    private shippingAuthorizationService: ShippingAuthorizationService,
    private errorHandler: ErrorHandler,
    private logger: Logger,
    private router: Router
  ) {}

  open(shippingAuthorization: ShippingAuthorization) {
    (<any>jQuery)('.modal').modal('hide');
    this.router.navigate(
      ['/shipping-authorization', shippingAuthorization.id, 'transportation', this.transportation.id],
      { queryParams: { origin: 'balance' } }
    );
  }

  get shippingAuthorizations(): ShippingAuthorization[]{
    return this.page.data;
  }
  ngOnInit() {
    Notification.clearErrors();
    this.loadList();

    this.page.changeQuery.subscribe(() => {
      this.loadList();
    });
  }

  loadList() {
    this.error = false;
    this.loading = true;
    this.shippingAuthorizationService.listPaged(null, this.page).then(() => {
      this.loading = false;
    }).catch(error => this.handleError(error));
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
