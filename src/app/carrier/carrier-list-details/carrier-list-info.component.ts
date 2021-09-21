import { ModalManager } from '../../shared/modals/modal-manager';
import { Carrier } from '../carrier';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-carrier-list-info',
  templateUrl: './carrier-list-info.component.html'
})
export class CarrierListInfoComponent implements OnInit {
  @Input() carrier: Carrier;

  logModal: ModalManager = new ModalManager();

  leftColumn: Array<any>;

  ngOnInit() {
    if (this.carrier.person.rg) {
      this.leftColumn = [
        ['Nome', this.carrier.person.name],
        ['Tipo de Pessoa', 'FÍSICA'],
        ['Nome Usual', this.carrier.person.tradingName],
        ['RG', this.carrier.person.rgFormat],
        ['CPF', this.carrier.person.documentFormat],
      ];
    } else {
      this.leftColumn = [
          ['Nome', this.carrier.person.name],
          ['Tipo de Pessoa', 'JURÍDICA'],
          ['Nome Fantasia', this.carrier.person.tradingName],
          ['Inscrição estadual', this.carrier.person.stateRegistration],
          ['CNPJ', this.carrier.person.documentFormat],
        ];
  }

  }
}
