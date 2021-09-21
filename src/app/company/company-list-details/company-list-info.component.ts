import { ModalManager } from '../../shared/modals/modal-manager';
import { Company } from '../company';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-company-list-info',
  templateUrl: './company-list-info.component.html'
})
export class CompanyListInfoComponent implements OnInit {
  @Input() company: Company;

  logModal: ModalManager = new ModalManager();

  leftColumn: Array<any>;

  ngOnInit() {
    this.leftColumn = [
      ['Nome Companhia' , this.company.name],
      ['Codigo AX' , this.company.codeAX],

    ];

  }
}
