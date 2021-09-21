import { ModalManager } from '../../shared/modals/modal-manager';
import { PositionLayer } from '../position-layer';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-position-layer-list-info',
  templateUrl: './position-layer-list-info.component.html'
})
export class PositionLayerListInfoComponent implements OnInit {
  @Input() positionLayer: PositionLayer;

  logModal: ModalManager = new ModalManager();

  leftColumn: Array<any>;

  ngOnInit(){
    this.leftColumn = [
      ['Código', this.positionLayer.code],
      ['Nome', this.positionLayer.name],
      ['Deslocamento X', this.positionLayer.shiftXString],
      ['Deslocamento Y', this.positionLayer.shiftYString],
      ['Armazém', this.positionLayer.warehouse ? this.positionLayer.warehouse.code  +' - ' + this.positionLayer.warehouse.name : ''],
    ];

  }
}
