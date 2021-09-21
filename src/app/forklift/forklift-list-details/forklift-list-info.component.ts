import { ModalManager } from '../../shared/modals/modal-manager';
import { Forklift } from '../forklift';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-forklift-list-info',
  templateUrl: './forklift-list-info.component.html'
})
export class ForkliftListInfoComponent implements OnInit {
  @Input() forklift: Forklift;

  logModal: ModalManager = new ModalManager();

  leftColumn: Array<any>;

  ngOnInit() {
    this.leftColumn = [
      ['Nome', this.forklift.name]
    ];
  }
}
