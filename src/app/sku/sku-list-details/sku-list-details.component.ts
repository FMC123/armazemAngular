import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Notification} from '../../shared/notification';
import {Sku} from "../sku";

@Component({
  selector: 'app-sku-list-details',
  templateUrl: './sku-list-details.component.html'
})
export class SkuDetailsComponent implements OnInit {
  sku: Sku;
  leftColumn: Array<any>;

  constructor(private route: ActivatedRoute) {
  }

  ngOnInit() {
    Notification.clearErrors();
    this.route.data.forEach((data: { sku: Sku }) => {
      this.sku = data.sku;
    });
    this.leftColumn = [
      ['Produto', this.sku.product],
      ['Descrição', this.sku.description],
      ['Código', this.sku.code],
      ['Unidade de Medida', this.sku.measurementUnit],
      ['Sigla de Medida', this.sku.measurementAcronym],
      ['Grupo SKU', this.sku.skuGroup.label],
      ['Quantidade SKU', this.sku.skuQuantity],
      ['Tamanho de Saca', this.sku.sackSize]
    ];
  }

}
