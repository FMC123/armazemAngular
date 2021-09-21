import { ServiceItem } from '../../service-item/service-item';
import { ModalManager } from '../../shared/modals/modal-manager';
import { OperationType } from './../operation-type';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-operation-type-info',
  templateUrl: './operation-type-info.component.html'
})
export class OperationTypeInfoComponent {
  @Input() operationType: OperationType;


  get items(): Array<ServiceItem>{
    if (typeof  this.operationType.serviceItemsInputs !== 'undefined'
    || this.operationType.serviceItemsInputs){
      return this.operationType.serviceItemsInputs;
    }

    return new Array<ServiceItem>();
  }

  logModal: ModalManager = new ModalManager();

  get leftColumn() {
    return [
      ['Descrição', this.operationType.description],
      ['Descrição Contrapartida', this.operationType.descriptionCounterpart],
      ['Tipo', this.operationType.type ? this.operationType.typeObject.name : ''],
      ['Entrada Padrão', this.operationType.isInputDefaultValue ? 'Sim' : 'Não'],
    ];
  }

  /*get rightColumn() {
    return [
      ['Reensaque normal', (this.operationType.itemReissuedNormal
        && this.operationType.itemReissuedNormal.code
        && this.operationType.itemReissuedNormal.description) ?
        `${this.operationType.itemReissuedNormal.code} - ${this.operationType.itemReissuedNormal.description}` : ''],
      ['Reensaque impróprio', (this.operationType.itemReissuedUnfit
        && this.operationType.itemReissuedUnfit.code
        && this.operationType.itemReissuedUnfit.description) ?
        `${this.operationType.itemReissuedUnfit.code} - ${this.operationType.itemReissuedUnfit.description}` : ''],
      ['Reensaque Prático', (this.operationType.itemReissuedPratical
        && this.operationType.itemReissuedPratical.code
        && this.operationType.itemReissuedPratical.description) ?
        `${this.operationType.itemReissuedPratical.code} - ${this.operationType.itemReissuedPratical.description}` : ''],
    ];
  }*/

}
