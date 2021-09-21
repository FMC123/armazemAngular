import { Certificate } from '../../../certificate/certificate';
import { FiscalNote } from '../../../fiscal-note/fiscal-note';
import { ErrorHandler } from '../../../shared/errors/error-handler';
import { Logger } from '../../../shared/logger/logger';
import { Notification } from '../../../shared/notification';
import { TransportationFiscalNoteCertificate } from './transportation-fiscal-note-certificate';
import { TransportationFiscalNoteCertificateService } from './transportation-fiscal-note-certificate.service';

import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-transportation-fiscal-note-certificate-list',
  templateUrl: 'transportation-fiscal-note-certificate-list.component.html'
})

export class TransportationFiscalNoteCertificateListComponent implements OnInit {

  @Input() fiscalNote: FiscalNote;

  loading: boolean;
  error: boolean;
  certificates: Array<TransportationFiscalNoteCertificate>;

  constructor(
    private service: TransportationFiscalNoteCertificateService,
    private errorHandler: ErrorHandler,
    private logger: Logger,
  ) {}

  ngOnInit() {
    Notification.clearErrors();
    this.loadList();
  }

  loadList() {
    this.error = false;
    this.loading = true;
    this.service
      .list(this.fiscalNote.transportation.id, this.fiscalNote.id)
      .then((certificates) => {
        this.loading = false;
        this.certificates = certificates;
      }).catch(error => this.handleError(error));
  }

  handleError(error) {
    this.error = true;
    this.loading = false;
    return this.errorHandler.fromServer(error);
  }
}
