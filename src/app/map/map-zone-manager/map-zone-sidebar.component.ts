import { ModalManager } from '../../shared/modals/modal-manager';
import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-map-zone-sidebar',
  templateUrl: './map-zone-sidebar.component.html'
})
export class MapZoneSidebarComponent implements OnInit {

  legendModal: ModalManager = new ModalManager();

  constructor() { }

  ngOnInit() { }
}
