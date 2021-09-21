import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BatchOperationCertificate } from 'app/batch-operation/batch-operation-certificate/batch-operation-certificate';
import { Subscription } from 'rxjs/Rx';

import { AppState } from '../../app-state.service';
import {
  BatchOperationCertificateService,
} from '../../batch-operation/batch-operation-certificate/batch-operation-certificate.service';
import { MarkupGroup } from '../../markup-group/markup-group';
import { Notification } from '../../shared/notification';
import { MapPositionLayer } from '../map-position/map-position-layer';
import { MapPositionsService } from '../map-position/map-positions.service';
import { MapHistory } from './map-history';
import { MapHistoryService } from './map-history.service';
import {MapPosition} from "../map-position/map-position";

@Component({
  selector: 'app-map-history',
  templateUrl: './map-history.component.html',
  providers: [
    MapPositionsService,
    MapHistoryService
  ]
})
export class MapHistoryComponent implements OnInit {

  storageUnitSyncSubscription: Subscription;

  constructor(
    private appState: AppState,
    private route: ActivatedRoute,
    private service: MapPositionsService,
    private historyService: MapHistoryService,
    private batchOperationCertificateService: BatchOperationCertificateService,
  ) { }

  ngOnInit() {
    this.appState.hideMenu();
    Notification.clearErrors();
    this.route.data.forEach((data: {
      history: MapHistory,
      layers: Array<MapPositionLayer>,
      markupGroups: Array<MarkupGroup>,
      batchOperationCertificates: Array<BatchOperationCertificate>
    }) => {
      this.historyService.history = data.history;
      this.service.positions = new Map<string, MapPosition>();
      data.layers.forEach((layer: MapPositionLayer) => {
        layer.mapPositions.forEach(mp => {
          this.service.positions.set(mp.stackId, mp);
        });
      });
      this.historyService.organizeStorageUnitsInsidePositions();
      this.service.addMarkupGroups(data.markupGroups);
      this.service.addBatchOperationCertificates(data.batchOperationCertificates);
    });
  }

  get loading(){
    return this.historyService.loading;
  }

}
