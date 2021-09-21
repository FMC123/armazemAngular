import { ModalManager } from '../../shared/modals/modal-manager';
import { Driver } from '../driver';
import { Component, Input, OnInit } from '@angular/core';
import {Formatter} from "../../shared/forms/formatter/Formatter";

@Component({
  selector: 'app-driver-list-info',
  templateUrl: './driver-list-info.component.html'
})
export class DriverListInfoComponent implements OnInit {
  @Input() driver: Driver;

  logModal: ModalManager = new ModalManager();

  leftColumn: Array<any>;

  ngOnInit() {
    this.leftColumn = [
      ['Nome', this.driver.name],
      ['CPF', this.getDocumentFormatted(this.driver.cpf)],
      ['CNH', this.driver.cnh],
      ['Validade CNH', this.driver.cnhExpirationDateString],
      ['Celular',  this.driver.cellPhone ? Formatter.phoneFormat(this.driver.cellPhone) : ''],
      ['Bloqueado', this.driver.blocked ? 'SIM' : 'NÃO'],
      ['Observação', this.driver.observation],
    ];
  }

  getDocumentFormatted(cpf: string) {
    return cpf.replace(
      /^(\d{3})(\d{3})(\d{3})(\d{2})/,
      '$1.$2.$3-$4'
    );
  }
}
