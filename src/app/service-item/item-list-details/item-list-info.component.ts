import { ModalManager } from '../../shared/modals/modal-manager';
import { ServiceItem } from '../service-item';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-service-item-list-info',
  templateUrl: './item-list-info.component.html'
})
export class ItemListInfoComponent implements OnInit {
  @Input() serviceItem: ServiceItem;

  logModal: ModalManager = new ModalManager();

  leftColumn: Array<any>;

  ngOnInit(){
    this.leftColumn = [
      ['Código', this.serviceItem.code],
      ['Descrição', this.serviceItem.description],
      ['Preço base', this.serviceItem.basePriceString],
      ['Cotação', this.serviceItem.indQuoteValString],
      ['ISS', this.serviceItem.indIssString],
      ['Desconto', this.serviceItem.indDiscountString],
      ['Tipo de Industria', this.serviceItem.industrialTypeName],
      ['Lote', this.serviceItem.batchMask],
      ['Uso', this.serviceItem.usageObject.name],
    ];
  }
}
