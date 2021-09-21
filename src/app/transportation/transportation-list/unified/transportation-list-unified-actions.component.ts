import { TransportationStatus } from '../../transportation-status';
import { ErrorHandler } from '../../../shared/errors/error-handler';
import { Transportation } from '../../transportation';
import { Notification } from '../../../shared/notification/notification';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { TransportationType } from "../../transportation-type";

@Component({
  selector: 'app-transportation-list-unified-actions',
  templateUrl: 'transportation-list-unified-actions.component.html'
})

export class TransportationListUnifiedActionsComponent implements OnInit {
  loading = false;

  @Input() transportation: Transportation;
  @Output() delete = new EventEmitter<string>(false);
  @Output() updateStatus = new EventEmitter<any>(false);

  constructor(
    private router: Router,
    private errorHandler: ErrorHandler,
  ) { }

  ngOnInit() { }

  onEditClick(event: Event) {
    event.stopPropagation();

    if (this.transportation.typeObject.code === TransportationType.IN.code)
      this.router.navigate(['/transportation', 'in', this.transportation.id, 'edit']);

    if (this.transportation.typeObject.code === TransportationType.OUT.code)
      this.router.navigate(['/transportation', 'out', this.transportation.id, 'edit']);
  }

  onDeleteClick(event: Event) {
    event.stopPropagation();
    this.delete.emit(this.transportation.id);
  }

  onCloseClick(event: Event) {
    event.stopPropagation();

    this.updateStatus.emit({
      transportation: this.transportation,
      status: TransportationStatus.FECHADO,
    });
  }

  onCancelReleaseClick(event: Event) {
    event.stopPropagation();

    this.updateStatus.emit({
      transportation: this.transportation,
      status: TransportationStatus.AGUARDANDO_LIBERACAO,
    });
  }

  allowEnter(event: Event) {
    event.stopPropagation();

    // verifica se existe nota fiscal vinculada
    if (this.transportation.type !== 'OUT' && (this.transportation.fiscalNotes == null || this.transportation.fiscalNotes.length == 0)) {
      Notification.notification('Preencher Nota Fiscal de Entrada. Autorização de Entrada não permitida.');
    }
    else {
      this.updateStatus.emit({
        transportation: this.transportation,
        status: TransportationStatus.AUTORIZACAO_EFETUADA,
      });
    }
  }

  cancelAllowEnter(event: Event) {
    event.stopPropagation();
    if(this.transportation.status == "PROCESSO_CARGA_DESCARGA"){
      this.updateStatus.emit({
        transportation: this.transportation,
        status: TransportationStatus.FECHADO,
      });
    }else{
      this.updateStatus.emit({
        transportation: this.transportation,
        status: TransportationStatus.AGUARDANDO_ENTRADA,
      });
    }
  }

  allowRelease(event: Event) {
    event.stopPropagation();

    this.updateStatus.emit({
      transportation: this.transportation,
      status: TransportationStatus.LIBERACAO_PERMITIDA,
    });
  }

}
