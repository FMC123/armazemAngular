import { ErrorHandler } from '../../shared/errors/error-handler';
import { Logger } from '../../shared/logger/logger';
import { TransportationTotals } from '../transportation-totals';
import { TransportationService } from '../transportation.service';

import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs/Rx';

@Component({
  selector: 'app-transportation-list-totals',
  templateUrl: 'transportation-list-totals.component.html'
})

export class TransportationListTotalsComponent implements OnInit, OnDestroy {
  opened = true;
  loading = false;

  openedInfo: any;
  closedInfo: any;
  inProgressInfo: any;

  refresherSubscription: Subscription;

 constructor(
    private service: TransportationService,
    private errorHandler: ErrorHandler,
    private logger: Logger
  ) {}

  ngOnInit() {
    this.load();

    this.setupAutoRefresher();
  }

  ngOnDestroy() {
    if (this.refresherSubscription && !this.refresherSubscription.closed) {
      this.refresherSubscription.unsubscribe();
    }

    this.refresherSubscription = null;
  }

  setupAutoRefresher() {
    this.refresherSubscription = Observable.timer(5000, 5000).subscribe(() => {
      this.load(true);
    });
  }

  load(skipLoading = false) {
    if (!skipLoading) {
      this.loading = true;
    }

    this.service
      .listTotals()
      .then((totals) => {
        this.loading = false;
        this.buildInfo(totals);
      }).catch(error => this.handleError(error));
  }

  handleError(error) {
    this.loading = false;
    return this.errorHandler.fromServer(error);
  }

  buildInfo(totals: Array<TransportationTotals>) {
    let openedData = totals.find(t => t.type === 'EM_ABERTO');
    this.openedInfo = [
      ['Entradas', openedData.inCount],
      ['Qtde. Sacas Entrada', openedData.inQuantity],
      ['Saídas', openedData.outCount],
      ['Qtde. Sacas Saída', openedData.outQuantity],
    ];

    let inProgressData = totals.find(t => t.type === 'EM_PROGRESSO');
    this.inProgressInfo = [
      ['Entradas', inProgressData.inCount],
      ['Qtde. Sacas Entrada', inProgressData.inQuantity],
      ['Saídas', inProgressData.outCount],
      ['Qtde. Sacas Saída', inProgressData.outQuantity],
    ];

    let closedData = totals.find(t => t.type === 'FECHADO');
    this.closedInfo = [
      ['Entradas', closedData.inCount],
      ['Qtde. Sacas Entrada', closedData.inQuantity],
      ['Saídas', closedData.outCount],
      ['Qtde. Sacas Saída', closedData.outQuantity],
    ];
  }

}
