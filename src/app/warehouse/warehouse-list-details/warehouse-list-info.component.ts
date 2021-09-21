import { Formatter } from '../../shared/forms/formatter/Formatter';
import { ModalManager } from '../../shared/modals/modal-manager';
import { Warehouse } from '../warehouse';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-warehouse-list-info',
  templateUrl: './warehouse-list-info.component.html'
})
export class WarehouseListInfoComponent implements OnInit {
  @Input() warehouse: Warehouse;

  logModal: ModalManager = new ModalManager();
  leftColumn: Array<any>;

  ngOnInit() {
    this.leftColumn = [
      ['Código', this.warehouse.code],
      ['Nome', this.warehouse.name],
      ['Sigla', this.warehouse.shortName],
      ['Tananho Limite da Pilha', this.warehouse.stackWeightLimitString],
      ['Código no Ax', this.warehouse.axCode],
    ];



  }
}
