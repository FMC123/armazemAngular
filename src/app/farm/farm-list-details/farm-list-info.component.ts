import { ModalManager } from '../../shared/modals/modal-manager';
import { Farm } from '../farm';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-farm-list-info',
  templateUrl: './farm-list-info.component.html'
})
export class FarmListInfoComponent implements OnInit {
  @Input() farm: Farm;

  logModal: ModalManager = new ModalManager();

  leftColumn: Array<any>;

  ngOnInit() {
    ;
    this.leftColumn = [
      ['Codigo' , this.farm.code],
      ['Nome' , this.farm.name],
      ['Enderesso' , this.farm.address],
      ['Registro Estadual' , this.farm.stateRegistration],
      ['CNPJ' , this.farm.cnpj],
      ['Latitude' ,  this.farm.latitude],
      ['Longitude' ,  this.farm.longitude],
      ['Tamanho da propriedade' ,  this.farm.farmSize],
      ['% Fazenda' ,  this.farm.farmPercentage],
      ['Unidade de medida' ,  this.farm.farmSizeUnit],
    ];

  }
}
