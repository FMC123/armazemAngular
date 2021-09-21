import { ModalManager } from '../../shared/modals/modal-manager';
import { ServiceInstructionType } from './../service-instruction-type';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-service-instruction-type-info',
  templateUrl: './service-instruction-type-info.component.html'
})
export class ServiceInstructionTypeInfoComponent {
  @Input() serviceInstructionType: ServiceInstructionType;

  logModal: ModalManager = new ModalManager();

  get leftColumn() {
    return [
      ['Sigla', this.serviceInstructionType.code],
      ['Nome', this.serviceInstructionType.name],
      ['Função', this.serviceInstructionType.purposeObject.name],
    ];
  }
}
