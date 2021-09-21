import { AppState } from '../app-state.service';
import { ModalManager } from '../shared/modals/modal-manager';
import { TrackingService } from './tracking.service';
import { Component, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-tracking',
  templateUrl: 'tracking.component.html'
})

export class TrackingComponent implements OnInit, OnDestroy {

  cartModal: ModalManager = new ModalManager();

  constructor(
    private service: TrackingService,
    private appState: AppState,
  ) { }

  ngOnInit() {
    this.appState.hideMenu();
    this.service.init().then(() => {});
  }

  ngOnDestroy() {
    this.service.destroy();
  }

  get initialLoading() {
    return this.service.initialLoading;
  }

  get positions() {
    return this.service.positions;
  }

}
