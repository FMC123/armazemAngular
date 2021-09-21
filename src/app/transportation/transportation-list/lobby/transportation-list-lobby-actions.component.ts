import { ModalManager } from '../../../shared/modals/modal-manager';
import { TransportationStatus } from '../../transportation-status';
import { TransportationService } from '../../transportation.service';
import { ErrorHandler } from '../../../shared/errors/error-handler';
import { Transportation } from '../../transportation';

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import {TransportationType} from "../../transportation-type";

@Component({
  selector: 'app-transportation-list-lobby-actions',
  templateUrl: 'transportation-list-lobby-actions.component.html'
})

export class TransportationListLobbyActionsComponent implements OnInit {
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

    if(this.transportation.typeObject.code === TransportationType.IN.code)
      this.router.navigate(['/transportation', 'in',  this.transportation.id, 'edit']);

    if(this.transportation.typeObject.code === TransportationType.OUT.code)
      this.router.navigate(['/transportation', 'out',  this.transportation.id, 'edit']);
  }

  onDeleteClick(event: Event) {
    event.stopPropagation();
    this.delete.emit(this.transportation.id);
  }

  onCloseClick(event) {
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

  cancelAllowEnter(event: Event) {
    event.stopPropagation();

    this.updateStatus.emit({
      transportation: this.transportation,
      status: TransportationStatus.AGUARDANDO_ENTRADA,
    });
  }

}
