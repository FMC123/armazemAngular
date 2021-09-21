import { ModalManager } from '../../shared/modals/modal-manager';
import { EconomicGroup } from '../economic-group';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-economic-group-list-info',
  templateUrl: './economic-group-list-info.component.html'
})
export class EconomicGroupListInfoComponent implements OnInit {
  @Input() economicGroup: EconomicGroup;

  logModal: ModalManager = new ModalManager();

  leftColumn: Array<any>;

  ngOnInit() {
    this.leftColumn = [
      ['Codigo Grupo Econômico' , this.economicGroup.code],
      ['Descricao Grupo Econômico' , this.economicGroup.description],

    ];

  }
}
