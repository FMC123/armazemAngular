import { ModalManager } from '../../shared/modals/modal-manager';
import { PurchaseProspect } from './../purchase-prospect';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-purchase-prospect-info',
  templateUrl: './purchase-prospect-info.component.html'
})
export class PurchaseProspectInfoComponent {
  @Input() purchaseProspect: PurchaseProspect;

  logModal: ModalManager = new ModalManager();

  get leftColumn() {
    return [
      ['Código', this.purchaseProspect.code],
      ['Data', this.purchaseProspect.createdDateString],
      ['Status', this.purchaseProspect.status],
      ['Contrato', this.purchaseProspect.contractPurchase],
      ['Cooperado', (this.purchaseProspect.collaborator.code
        + ' - ' + this.purchaseProspect.collaborator.name)],
      ['Romaneio', this.purchaseProspect.batchOperation.batchOperationCode],
      ['Observação', this.purchaseProspect.observation]
    ];
  }



}
