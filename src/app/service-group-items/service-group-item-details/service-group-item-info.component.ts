import { ServiceGroupItem } from '../service-group-item';
import { ModalManager } from '../../shared/modals/modal-manager';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-service-group-item-info',
  templateUrl: './service-group-item-info.component.html'
})
export class ServiceGroupItemInfoComponent implements OnInit {
  @Input() serviceGroupItem: ServiceGroupItem;

  logModal: ModalManager = new ModalManager();

  leftColumn: Array<any>;

  ngOnInit() {
    this.leftColumn = [
      ['Grupo de Serviço:', this.serviceGroupItem.serviceGroup.code + " - " + this.serviceGroupItem.serviceGroup.description],
      ['ServiceItem:', this.serviceGroupItem.serviceItem.description],
    ];

  }
}
