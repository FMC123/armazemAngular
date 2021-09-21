import { ErrorHandler } from '../shared/errors/error-handler';
import { TransportationService } from '../transportation/transportation.service';
import { Component, OnInit } from '@angular/core';
import { ParameterService } from 'app/parameter/parameter.service';

@Component({
  selector: 'app-unified-actions',
  templateUrl: 'unified-actions.component.html'
})

export class UnifiedActionsComponent implements OnInit {

  loading = false;
  fiscalNoteScreenDefault: boolean;
  purchaseOrderScreenDefault: boolean;

  constructor(
    private parameterService: ParameterService,
    private transportationService: TransportationService,
    private errorHandler: ErrorHandler,
  ) { }

  ngOnInit() {
    this.fiscalNoteScreenDefault = this.parameterService.useEntryForecastTransportation();
    this.purchaseOrderScreenDefault = this.parameterService.usePurchaseOrderTransportation();
  }

  downloadWaitList() {
    this.loading = true;

    return this.transportationService.downloadWaitList().then(() => {
      this.loading = false;
    }).catch(error => this.handleError(error));
  }

  handleError(error) {
    this.loading = false;
    return this.errorHandler.fromServer(error);
  }
}
