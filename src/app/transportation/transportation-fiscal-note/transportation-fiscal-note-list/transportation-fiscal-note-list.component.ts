import { BalanceService } from '../../../balance/balance.service';
import { FiscalNote } from '../../../fiscal-note/fiscal-note';
import { ErrorHandler } from '../../../shared/errors/error-handler';
import { Logger } from '../../../shared/logger/logger';
import { ModalManager } from '../../../shared/modals/modal-manager';
import { Notification } from '../../../shared/notification';
import { Transportation } from '../../transportation';
import { TransportationFiscalNoteService } from '../transportation-fiscal-note.service';
import { NumberHelper } from '../../../shared/globalization';

import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-transportation-fiscal-note-list',
  templateUrl: 'transportation-fiscal-note-list.component.html'
})
export class TransportationFiscalNoteListComponent implements OnInit {
  @Input() fiscalNotes: FiscalNote[];

  loading: boolean;
  downloadLoading: boolean;
  error: boolean;
  invoiceFieldBlock = false;
  purchaseFieldBlock = false;

  constructor(
    private service: TransportationFiscalNoteService,
    private errorHandler: ErrorHandler,
    private logger: Logger,
    private balanceService: BalanceService
  ) {}

  get sumfiscalNotesQuantity() {
    
		let total = this.fiscalNotes.map(b => b.quantity).reduce((a, b) => a + b, 0);
		return NumberHelper.toTrunc(total);

  }

  ngOnInit() {
    Notification.clearErrors();

    this.service.invoiceFieldBlock().then(invoiceFieldBlock => {
      this.invoiceFieldBlock = invoiceFieldBlock;
    });
    this.service.hiddenPurchaseFiled().then(purchaseFieldBlock => {
      this.purchaseFieldBlock = purchaseFieldBlock;
    });
  }

  handleError(error) {
    this.error = true;
    this.loading = false;
    return this.errorHandler.fromServer(error);
  }

  downloadInputFormTicket(event: Event, id: string) {
    event.stopPropagation();
    this.downloadLoading = true;
    return this.balanceService
      .downloadInputFormTicket(id)
      .then(() => {
        this.downloadLoading = false;
      })
      .catch(error => {
        if (error.status === 400){
          Notification.error('A soma do peso líquido dos lotes não confere com o peso líquido do romaneio');
        } else {
          this.handleError(error);
        }
        this.downloadLoading = false;
      });
  }
}
