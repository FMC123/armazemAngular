import { Masks } from './../../shared/forms/masks/masks';
import { ModalManager } from '../../shared/modals/modal-manager';
import { CustomerContact } from '../customer-contact';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-customer-contact-list-info',
  templateUrl: './customer-contact-list-info.component.html'
})
export class CustomerContactListInfoComponent implements OnInit {
  @Input() customerContact: CustomerContact;

  logModal: ModalManager = new ModalManager();

  leftColumn: Array<any>;
  phoneMask = Masks.phoneMask.mask('');

  ngOnInit() {

    this.leftColumn = [
      ['Nome' , this.customerContact.name],
      ['E-mail' , this.customerContact.email],
      ['Fax' , this.customerContact.fax ? CustomerContact.formatPhone(this.customerContact.fax) : ''],
      ['Telefone' , this.customerContact.phone ? CustomerContact.formatPhone(this.customerContact.phone) : ''],
      ['Ramal' , this.customerContact.extensionLine ? this.customerContact.extensionLine : ''],
      ['Celular' ,this.customerContact.cellPhone ? CustomerContact.formatPhone(this.customerContact.cellPhone) : ''],
      ['Contato Principal' , this.customerContact.main ? 'SIM' : 'NÃO'],
      ['Enviar Relatorio' , this.customerContact.indSendReport ? 'SIM' : 'NÃO'],
      ['Enviar Relatorio de Ticket de Peso' , this.customerContact.indSendPackingTicketWeight ? 'SIM' :'NÃO'],
    ];

  }
}
