import { Certificate } from '../../../certificate/certificate';
import { FiscalNote } from '../../../fiscal-note/fiscal-note';
import { ErrorHandler } from '../../../shared/errors/error-handler';
import { Logger } from '../../../shared/logger/logger';
import { ModalManager } from '../../../shared/modals/modal-manager';
import { Notification } from '../../../shared/notification';
import { TransportationFiscalNoteCertificate } from './transportation-fiscal-note-certificate';
import { TransportationFiscalNoteCertificateService } from './transportation-fiscal-note-certificate.service';

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-transportation-fiscal-note-certificate-memory-list',
  templateUrl: 'transportation-fiscal-note-certificate-memory-list.component.html'
})

export class TransportationFiscalNoteCertificateMemoryListComponent implements OnInit {

  @Output() edit = new EventEmitter<TransportationFiscalNoteCertificate>();
  @Input() fiscalNote: FiscalNote;

  deleteConfirm: ModalManager = new ModalManager();

  get certificates() {
    return this.fiscalNote.certificates;
  }

  constructor() {}

  ngOnInit() {}

  onEditClick(event: Event, certificate: TransportationFiscalNoteCertificate) {
    event.stopPropagation();
    this.edit.emit(certificate);
  }

  onDeleteClick(event: Event, certificate: TransportationFiscalNoteCertificate) {
    event.stopPropagation();
    this.deleteConfirm.open(certificate);
  }

  delete(certificate: TransportationFiscalNoteCertificate) {
    let index = this.certificates.findIndex(c => {
      return (!!certificate.id && c.id === certificate.id)
      || (!!certificate.tempId || c.tempId === certificate.tempId)
    });

    this.certificates.splice(index, 1);
  }

}
