import { Transportation } from '../../transportation';
import { TransportationStatus } from '../../transportation-status';
import { TransportationService } from '../../transportation.service';
import { Notification } from '../../../shared/notification/notification';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { ErrorHandler } from "../../../shared/errors/error-handler";

@Component({
  selector: 'app-transportation-list-balance-actions',
  templateUrl: 'transportation-list-balance-actions.component.html'
})

export class TransportationListBalanceActionsComponent implements OnInit {
  @Input() transportation: Transportation;
  @Output() delete = new EventEmitter<string>(false);
  @Output() updateStatus = new EventEmitter<any>(false);

  loading = false;

  constructor(
    private router: Router,
    private service: TransportationService,
    private errorHandler: ErrorHandler,
  ) { }

  ngOnInit() { }

  allowEnter(event: Event) {
    event.stopPropagation();
    // verifica se existe nota fiscal vinculada
    if (this.transportation.type !== 'OUT' && (this.transportation.fiscalNotes == null || this.transportation.fiscalNotes.length == 0)) {
      Notification.notification('Preencher Nota Fiscal de Entrada. Autorização de Entrada não permitida.');
    } else {
      this.updateStatus.emit({
        transportation: this.transportation,
        status: TransportationStatus.AUTORIZACAO_EFETUADA,
      });
    }
  }

  cancelAllowEnter(event: Event) {
    event.stopPropagation();

    this.updateStatus.emit({
      transportation: this.transportation,
      status: TransportationStatus.AGUARDANDO_ENTRADA,
    });
  }

  allowRelease(event: Event) {
    event.stopPropagation();

    this.updateStatus.emit({
      transportation: this.transportation,
      status: TransportationStatus.LIBERACAO_PERMITIDA,
    });
  }

  onCancelReleaseClick(event: Event) {
    event.stopPropagation();

    this.updateStatus.emit({
      transportation: this.transportation,
      status: TransportationStatus.AGUARDANDO_LIBERACAO,
    });
  }

  downloadDocumentEntryReport() {
    this.loading = true;
    let blob: Promise<Blob> = this.service.downloadDocumentEntryReport(this.transportation.id);
    blob.then((b) => {
      if (b.size === 0) {
        Notification.error('Não foi encontrado informações para abrir o relatório!');
      } else {
        let urlReport = window.URL.createObjectURL(b);
        window.open(urlReport);
      }
      this.loading = false;
    });
  }

  downloadDocumentExitReport() {
    this.loading = true;
    let blob: Promise<Blob> = this.service.downloadDocumentExitReport(this.transportation.id);
    blob.then((b) => {
      if (b.size === 0) {
        Notification.error('Não foi encontrado informações para abrir o relatório!');
      } else {
        let urlReport = window.URL.createObjectURL(b);
        window.open(urlReport);
      }
      this.loading = false;
    });
  }

}
