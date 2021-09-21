import { PackStockMovementGroup } from '../pack-stock-movement-group';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Notification } from './../../shared/notification/notification';

@Component({
  selector: 'app-pack-stock-details',
  templateUrl: './pack-stock-details.component.html'
})
export class PackStockDetailsComponent implements OnInit {
  group: PackStockMovementGroup;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    Notification.clearErrors();
    this.route.data.forEach((data: {group: PackStockMovementGroup}) => {
      this.group = data.group;
    });
  }

  get leftColumn() {
    return [
      ['Origem', this.group.recordTypeObject.shortCode],
      ['Data de entrada', this.group.registrationDateString],
//      ['Proprietário', this.group.owner.code + ' - ' + this.group.owner.person.name],
    ];
  }

  get rightColumn() {
    return [
      ['Documento', this.group.document],
      ['Tipo de operação', this.group.operationTypeOnOut ? this.group.operationTypeOnOut.description || '' : ''],
      ['Observações', this.group.observation],
    ];
  }

}
