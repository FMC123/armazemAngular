import { ModalManager } from '../../shared/modals/modal-manager';
import { Collaborator } from '../collaborator';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-collaborator-list-info',
  templateUrl: './collaborator-list-info.component.html'
})
export class CollaboratorListInfoComponent implements OnInit {
  @Input() collaborator: Collaborator;

  logModal: ModalManager = new ModalManager();

  leftColumn: Array<any>;

  ngOnInit() {
    if (this.collaborator.person.rg) {
      this.leftColumn = [
        ['Nome', this.collaborator.person.name],
        ['Tipo de Pessoa', 'FÍSICA'],
        ['Nome Usual', this.collaborator.person.tradingName],
        ['RG', this.collaborator.person.rgFormat],
        ['CPF', this.collaborator.person.documentFormat],
      ];
    } else {
      this.leftColumn = [
          ['Nome', this.collaborator.person.name],
          ['Tipo de Pessoa', 'JURÍDICA'],
          ['Nome Fantasia', this.collaborator.person.tradingName],
          ['Inscrição estadual', this.collaborator.person.stateRegistration],
          ['CNPJ', this.collaborator.person.documentFormat],
        ];
  }

  }
}
