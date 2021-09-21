import { FiscalNote } from '../../../fiscal-note/fiscal-note';
import { ErrorHandler } from '../../../shared/errors/error-handler';
import { Logger } from '../../../shared/logger/logger';
import { ModalManager } from '../../../shared/modals/modal-manager';
import { Notification } from '../../../shared/notification';
import { Transportation } from '../../transportation';
import { TransportationFiscalNoteCertificate } from '../certificate/transportation-fiscal-note-certificate';
import { TransportationFiscalNoteService } from '../transportation-fiscal-note.service';
import { NumberHelper } from '../../../shared/globalization';

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
const uuid = require('uuid/v4');

@Component({
  selector: 'app-transportation-fiscal-note-memory-list',
  templateUrl: 'transportation-fiscal-note-memory-list.component.html'
})

export class TransportationFiscalNoteMemoryListComponent implements OnInit {
  @Input() transportation: Transportation;
  @Output() edit = new EventEmitter<FiscalNote>(false);
  @Input() enabledCertificatesWriteable: boolean;

  deleteConfirm: ModalManager = new ModalManager();
  fiscalNote: FiscalNote;
  certificate: TransportationFiscalNoteCertificate;
  certificateFormModal: ModalManager = new ModalManager();
  idInterval: any;


  get fiscalNotes() {
    return this.transportation.fiscalNotes;
  }

  get sumfiscalNotesQuantity() {

		let total = this.transportation.fiscalNotes.map(b => b.quantity).reduce((a, b) => Number(a) + Number(b), 0);
		return NumberHelper.toTrunc(total);
  }

  constructor() { }

  ngOnInit() {
    this.idInterval = setInterval(() => {
      this.checkIfAddCertificateToFiscanlNoteAutomatic();
    }, 1000);
  }

  ngOnDestroy() {
    if (this.idInterval) {
      clearInterval(this.idInterval);
    }
  }

  onEditClick(event: Event, fiscalNote: FiscalNote) {
    event.stopPropagation();
    this.edit.emit(fiscalNote);
  }

  onDeleteClick(event: Event, fiscalNote: FiscalNote) {
    event.stopPropagation();
    this.deleteConfirm.open(fiscalNote);
  }

  delete(fiscalNote: FiscalNote) {
    let index = this.fiscalNotes.findIndex(fn => {
      return (!!fiscalNote.id && fn.id === fiscalNote.id)
        || (!!fiscalNote.tempId || fn.tempId === fiscalNote.tempId)
    });

    this.fiscalNotes.splice(index, 1);
  }

  addOrUpdateCertificate(certificate: TransportationFiscalNoteCertificate) {

    if (!certificate.id && !certificate.tempId) {
      certificate.tempId = uuid();

      // não pode duplicar o certificado
      let existe: Boolean = false;
      if (this.fiscalNote.certificates != null && this.fiscalNote.certificates.length > 0) {
        for (const index in this.fiscalNote.certificates) {
          if (this.fiscalNote.certificates[index].certificate.id == certificate.certificate.id) {
            existe = true;
            break;
          }
        }
      }

      if (existe == false) {
        this.fiscalNote.certificates.push(certificate);
      }
    }
  }

  openCertificateForm(
    event: Event,
    fiscalNote: FiscalNote,
    certificate: TransportationFiscalNoteCertificate
  ) {
    if (event) {
      event.stopPropagation();
    }

    this.fiscalNote = fiscalNote;
    this.certificate = certificate;

    if (!this.certificate) {
      this.certificate = new TransportationFiscalNoteCertificate();
    }

    this.certificateFormModal.open(null);
  }

  /**
   * Verifica se precisa adicionar certificado no nota fiscal através de confirmação do usuário.
   */
  checkIfAddCertificateToFiscanlNoteAutomatic() {

    if (TransportationFiscalNoteService.fiscalNoteToAddCertificate != null) {
      let fiscalNote = TransportationFiscalNoteService.fiscalNoteToAddCertificate;
      this.openCertificateByConfirmation(fiscalNote);
    }
  }

  /**
   * Abre form de adição de certificado automaticamente por meior de confirmação
   *
   * @param fiscalNote
   */
  openCertificateByConfirmation(fiscalNote: FiscalNote) {

    this.fiscalNote = fiscalNote;
    this.certificate = new TransportationFiscalNoteCertificate();
    this.certificateFormModal.open(null);
    TransportationFiscalNoteService.fiscalNoteToAddCertificate = null;
  }
}
