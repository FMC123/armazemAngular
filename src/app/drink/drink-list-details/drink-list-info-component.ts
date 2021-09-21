import { ModalManager } from '../../shared/modals/modal-manager';
import { Drink } from '../drink';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-drink-list-info',
  templateUrl: './drink-list-info.component.html'
})
export class DrinkListInfoComponent implements OnInit {
  @Input() drink: Drink;

  logModal: ModalManager = new ModalManager();

  leftColumn: Array<any>;

  ngOnInit() {
    this.leftColumn = [
      ['Código Bebida' , this.drink.code],
      ['Nome Bebida' , this.drink.name],
      ['Descrição Bebida' , this.drink.description],

    ];

  }
}
