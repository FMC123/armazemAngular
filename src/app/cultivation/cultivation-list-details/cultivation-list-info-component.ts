import { ModalManager } from '../../shared/modals/modal-manager';
import { Cultivation } from '../cultivation';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-cultivation-list-info',
  templateUrl: './cultivation-list-info.component.html'
})
export class CultivationListInfoComponent implements OnInit {
  @Input() cultivation: Cultivation;

  logModal: ModalManager = new ModalManager();

  leftColumn: Array<any>;

  ngOnInit() {
    this.leftColumn = [
      ['Nome Cultura' , this.cultivation.cultivationName],
      ['Descricao Bebida' , this.cultivation.cultivationDescription],

    ];

  }
}
