import { Component, OnInit } from '@angular/core';

import { ModalManager } from '../../shared/modals/modal-manager';
import { MapRealtimeService } from './map-realtime.service';
import { MapPositionsService } from '../map-position/map-positions.service';

@Component({
  selector: 'app-map-realtime-sidebar',
  templateUrl: './map-realtime-sidebar.component.html'
})
export class MapRealtimeSidebarComponent implements OnInit {

  storageUnitMoveModal = new ModalManager();

  constructor(
    private service: MapRealtimeService,
    public mapPositionsService: MapPositionsService
  ) { }

  ngOnInit() {}

  get positions() {
    return this.mapPositionsService.positions;
  }

  get markupGroupEditable() {
    return this.service.markupGroupEditable;
  }

  clearMarkupGroupEditable() {
    this.service.markupGroupEditable = null;
  }

}
