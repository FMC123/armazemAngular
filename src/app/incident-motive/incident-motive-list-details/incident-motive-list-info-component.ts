import { ModalManager } from '../../shared/modals/modal-manager';
import { Component, Input, OnInit } from '@angular/core';
import { IncidentMotive } from '../incident-motive';

@Component({
  selector: 'app-drink-list-info',
  templateUrl: './incident-motive-list-info.component.html'
})
export class IncidentMotiveListInfoComponent implements OnInit {
  @Input() incidentMotive: IncidentMotive;

  logModal: ModalManager = new ModalManager();

  leftColumn: Array<any>;

  ngOnInit() {
    this.leftColumn = [
      ['Código Incidente', this.incidentMotive.code],
      ['Descrição Incidente', this.incidentMotive.description],

    ];

  }
}
