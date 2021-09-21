import { ModalManager } from '../../../shared/modals/modal-manager';
import { TransportationStatus } from '../../transportation-status';
import { TransportationService } from '../../transportation.service';
import { ErrorHandler } from '../../../shared/errors/error-handler';
import { Transportation } from '../../transportation';

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-transportation-list-select-actions',
  templateUrl: 'transportation-list-select-actions.component.html'
})

export class TransportationListSelectActionsComponent implements OnInit {
  @Output() select = new EventEmitter<void>(false);

  constructor(
  ) { }

  ngOnInit() { }
}
