import { ErrorHandler } from '../shared/errors/error-handler';
import { TransportationService } from '../transportation/transportation.service';

import { Component, OnInit } from '@angular/core';
import { ParameterService } from 'app/parameter/parameter.service';

@Component({
  selector: 'app-lobby-actions',
  templateUrl: 'lobby-actions.component.html',
  styleUrls: ['lobby-actions.component.css']
})

export class LobbyActionsComponent implements OnInit {

  loading = false;
  entryForecastScreenDefault: boolean;
  purchaseOrderScreenDefault: boolean;

  constructor(
    private parameterService: ParameterService,
    private transportationService: TransportationService,
    private errorHandler: ErrorHandler,
  ) { }

  ngOnInit() {
    this.entryForecastScreenDefault = this.parameterService.useEntryForecastTransportation();
    this.purchaseOrderScreenDefault = this.parameterService.usePurchaseOrderTransportation();
  }

  downloadWaitList() {
    this.loading = true;

    this.transportationService.downloadWaitList().then(() => {
      this.loading = false;
    }).catch(error => this.handleError(error));
  }

  handleError(error) {
    this.loading = false;
    return this.errorHandler.fromServer(error);
  }
}
