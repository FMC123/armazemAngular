import { ModalManager } from '../../shared/modals/modal-manager';

import { Component, OnInit, Input } from '@angular/core';
import {Stack} from "../stack";


@Component({
  selector: 'app-stack-list-info',
  templateUrl: './stack-list-info.component.html'
})
export class StackListInfoComponent implements OnInit {
  @Input() stack: Stack;

  logModal: ModalManager = new ModalManager();

  leftColumn: Array<any>;
  rightColumn: Array<any>;

  ngOnInit(){
    this.leftColumn = [
      ['Código', this.stack.code],
      ['Coordenada X', this.stack.xCoordString],
      ['Coordenada Y', this.stack.yCoordString],
      ['Altura', this.stack.heightString],
      ['Largura', this.stack.widthString],
    ];
    this.rightColumn=[
      ['Altura da Pilha', this.stack.stackHeight],
      ['Distancia', this.stack.distanceString],
      ['Rotação', this.stack.rotationString],
      ['Posição', this.stack.position.nameCode ],

    ];

  }

}
