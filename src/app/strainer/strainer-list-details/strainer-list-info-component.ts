import { ModalManager } from '../../shared/modals/modal-manager';
import { Strainer } from '../strainer';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-strainer-list-info',
  templateUrl: './strainer-list-info.component.html'
})
export class StrainerListInfoComponent implements OnInit {
  @Input() strainer: Strainer;

  logModal: ModalManager = new ModalManager();

  leftColumn: Array<any>;

  ngOnInit() {
    this.leftColumn = [
      ['Código Peneira' , this.strainer.code],
      ['Descricao Peneira' , this.strainer.description],
      ['Consumo Peneira' , this.strainer.consumeAsString],

    ];

  }
}
