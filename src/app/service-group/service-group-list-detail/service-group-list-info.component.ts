import { ServiceGroup } from '../service-group';

import { ModalManager } from '../../shared/modals/modal-manager';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-service-group-list-info',
  templateUrl: './service-group-list-info.component.html'
})
export class ServiceGroupListInfoComponent implements OnInit {
  @Input() serviceGroup: ServiceGroup;

  logModal: ModalManager = new ModalManager();

  leftColumn: Array<any>;

  ngOnInit() {
    this.leftColumn = [
      ['Código', this.serviceGroup.code],
      ['Descrição', this.serviceGroup.description],
      ['Agrupar para Calculo', this.serviceGroup.indGroupToCalc? 'Sim': 'Não'],
    ];

  }
}
