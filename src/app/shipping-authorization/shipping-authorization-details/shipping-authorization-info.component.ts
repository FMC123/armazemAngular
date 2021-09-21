import { ModalManager } from '../../shared/modals/modal-manager';
import { ShippingAuthorization } from './../shipping-authorization';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-shipping-authorization-info',
  templateUrl: './shipping-authorization-info.component.html'
})
export class ShippingAuthorizationInfoComponent {
  @Input() shippingAuthorization: ShippingAuthorization;

  logModal: ModalManager = new ModalManager();

  get leftColumn() {
    return [
      ['Código', this.shippingAuthorization.code],
      ['Tipo', this.shippingAuthorization.typeObject ? this.shippingAuthorization.typeObject.name || '' : ''],
      ['Data prevista', this.shippingAuthorization.expectedDateString],
      ['Cliente', this.shippingAuthorization.markupGroup.ownersBatchesNames]
    ];
  }

  get rightColumn() {
    return [
      ['Venda', this.shippingAuthorization.sellCode],
      [
        'Armazém de destino', (this.shippingAuthorization.destinationWarehouse)
          ? this.shippingAuthorization.destinationWarehouse.name : '',
      ],
      ['Destinatátio', (this.shippingAuthorization.destinatary)
        ? this.shippingAuthorization.destinatary.person.name : ''],
      ['Observação', (this.shippingAuthorization.observation)
        ? this.shippingAuthorization.observation : '']
    ];
  }
}
