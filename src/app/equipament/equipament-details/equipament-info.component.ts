import { ModalManager } from '../../shared/modals/modal-manager';
import { Equipament } from './../equipament';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-equipament-info',
  templateUrl: './equipament-info.component.html'
})
export class EquipamentInfoComponent {
  @Input() equipament: Equipament;

  logModal: ModalManager = new ModalManager();

  get leftColumn() {
    return [
        ['Código', this.equipament.code],
        ['Descrição', this.equipament.description],
      ];
  }

  get rightColumn() {
    return  [
      ['Tipo', this.equipament.type ? this.equipament.type.code + ' - ' + this.equipament.type.description : ''],
      ['Armazém', this.equipament.warehouse ? this.equipament.warehouse.name : ''],
    ];
  }

}
