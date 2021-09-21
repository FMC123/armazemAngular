import { ModalManager } from '../../shared/modals/modal-manager';
import { ServiceRequest } from './../service-request';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-service-request-info',
  templateUrl: './service-request-info.component.html'
})
export class ServiceRequestInfoComponent {
  @Input() serviceRequest: ServiceRequest;

  logModal: ModalManager = new ModalManager();

  get leftColumn() {

    let arr = [
      ['Código', this.serviceRequest.code],
      ['Data de Abertura', this.serviceRequest.createdDateString ? this.serviceRequest.createdDateString : "-"],
      ['Cliente', this.serviceRequest.collaborator ? this.serviceRequest.collaborator.name : "-"],
      ['Usuario', this.serviceRequest.user ? this.serviceRequest.user.name : "-"],
      ['Lotes', this.serviceRequest.batchesString ? this.serviceRequest.batchesString : "-"],
    ];

    // não mostra lotes não cadastrados se não houver
    if (this.serviceRequest.batchesNotRegisteredString != '') {
      arr.push(['Lotes não cadastrados', this.serviceRequest.batchesRegisteredString]);
    }

    arr.push(['Tipo', this.serviceRequest.typeObject.name]);
    arr.push(['Data de Fechamento', this.serviceRequest.closedDate ? this.serviceRequest.closedDateString : "-"]);
    arr.push(['Situação', this.serviceRequest.statusObject.name]);
    arr.push(['Observação', this.serviceRequest.observation]);
    return arr;
  }
}
