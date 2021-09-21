import { ModalManager } from '../../shared/modals/modal-manager';
import { Address } from '../address';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-address-list-info',
  templateUrl: './address-list-info.component.html'
})
export class AddressListInfoComponent implements OnInit {
  @Input() address: Address;

  logModal: ModalManager = new ModalManager();

  leftColumn: Array<any>;

  ngOnInit() {

    this.leftColumn = [
      ['Logradouro' , this.address.publicPlace],
      ['Número' , this.address.number],
      ['Bairro' , this.address.neighbourhood],
      ['CEP' , this.address.zipCode],
      ['Tipo Endereço' , this.address.typeAddress ? this.address.typeAddress.name : ''],
      ['Principal' , this.address.main],
      ['Pais' , this.address.country ? this.address.country.name : ''],
      ['Estado' , this.address.uf ? this.address.uf.name : ''],
      ['Municipio' , this.address.city ? this.address.city.name : ''],
    ];

  }
}
