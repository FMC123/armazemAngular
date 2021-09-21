import { ModalManager } from '../../shared/modals/modal-manager';
import { WarehouseStakeholder } from '../warehouse-stakeholder';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-warehouse-stakeholder-list-info',
  templateUrl: './warehouse-stakeholder-list-info.component.html'
})
export class WarehouseStakeholderListInfoComponent implements OnInit {
  @Input() warehouseStakeholder: WarehouseStakeholder;

  logModal: ModalManager = new ModalManager();

  leftColumn: Array<any>;

  ngOnInit(){
    this.leftColumn = [
      ['Nome', this.warehouseStakeholder.person && this.warehouseStakeholder.person.name ? this.warehouseStakeholder.person.name : ''],
      ['Nome Usual', this.warehouseStakeholder.person && this.warehouseStakeholder.person.tradingName
        ? this.warehouseStakeholder.person.tradingName : ''],
      ['Documento', this.warehouseStakeholder.person && this.warehouseStakeholder.person.document
        ? this.warehouseStakeholder.person.document : ''],
      ['Tipo de Cliente', this.warehouseStakeholder.person && this.warehouseStakeholder.person.personType
        ? this.warehouseStakeholder.person.personTypeName : ''],
      ['Situação', this.warehouseStakeholder.person.active ? 'Ativo' : 'Inativo'],
    ];

  }
}
