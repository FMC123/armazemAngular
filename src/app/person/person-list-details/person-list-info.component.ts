import { PersonType } from './../person-type';
import { ModalManager } from '../../shared/modals/modal-manager';
import { Person } from '../person';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-person-list-info',
  templateUrl: './person-list-info.component.html'
})
export class PersonListInfoComponent implements OnInit {
  @Input() person: Person;

  logModal: ModalManager = new ModalManager();

  public ngOnInit(): void {

  }

  get leftColumn() {
    if (this.person.personType === PersonType.PHYSICAL.code) {
      return [
        ['Nome', this.person.name],
        ['Nome Usual', this.person.tradingName],
        ['CPF', this.person.documentFormat],
        ['RG', this.person.rgFormat],
        ['Tipo de Pessoa', this.person.personTypeName],
        ['Situação', this.person.active ? 'Ativo' : 'Inativo'],
        ['Grupo Econômico', this.person.economicGroup ?
          `${this.person.economicGroup.code} - ${this.person.economicGroup.description}` : ''],
      ];
    } else if (this.person.personType === PersonType.PRODUCER.code) {
      return [
        ['Nome', this.person.name],
        ['Nome Usual', this.person.tradingName],
        ['CPF', this.person.documentFormat],
        ['RG', this.person.rgFormat],
        ['Registro Produtor Rural', this.person.producerRegistration],
        ['Tipo de Pessoa', this.person.personTypeName],
        ['Situação', this.person.active ? 'Ativo' : 'Inativo'],
        ['Grupo Econômico', this.person.economicGroup ?
          `${this.person.economicGroup.code} - ${this.person.economicGroup.description}` : ''],
      ];
    } else if (this.person.personType === PersonType.JURIDICAL.code) {
      return [
        ['Nome', this.person.name],
        ['Nome Fantasia', this.person.tradingName],
        ['CNPJ', this.person.documentFormat],
        ['Inscrição Estadual', this.person.stateRegistration],
        ['Tipo de Pessoa', this.person.personTypeName],
        ['Situação', this.person.active ? 'Ativo' : 'Inativo'],
        ['Grupo Econômico', this.person.economicGroup ?
          `${this.person.economicGroup.code} - ${this.person.economicGroup.description}` : ''],
      ];
    } else {
      return [
        ['Nome', this.person.name],
        ['Nome Usual', this.person.tradingName],
        ['Documento', this.person.documentFormat],
        ['Tipo de Pessoa', this.person.personTypeName],
        ['Situação', this.person.active ? 'Ativo' : 'Inativo'],
        ['Grupo Econômico', this.person.economicGroup ?
          `${this.person.economicGroup.code} - ${this.person.economicGroup.description}` : ''],
      ];
    }
  }

}
