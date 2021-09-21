import { ModalManager } from '../../shared/modals/modal-manager';
import { PackType } from './../pack-type';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-pack-type-info',
  templateUrl: './pack-type-info.component.html'
})
export class PackTypeInfoComponent {
  @Input() packType: PackType;

  logModal: ModalManager = new ModalManager();

  get leftColumn() {
    return [
        ['Descrição', this.packType.description],
        ['Peso', this.packType.weightString],
        ['Capacidade', this.packType.capacityString],
      ];
  }

  get rightColumn() {
    return  [
      ['Controla estoque?', this.packType.trackStock ? 'Sim' : 'Não'],
      ['Item de locação', this.packType.rentServiceItem ? this.packType.rentServiceItem.description : ''],
      ['Item de armazenagem', this.packType.storageServiceItem ? this.packType.storageServiceItem.description : ''],
      ['Tipo Genérico', this.packType.genericType ? this.packType.genericTypeObject.name : ''],
    ];
  }

}
