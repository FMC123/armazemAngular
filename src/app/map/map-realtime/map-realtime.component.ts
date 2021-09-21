import {BatchPositionService} from '../../batch/batch-position/batch-position.service';
import {BatchPosition} from '../../batch/batch-position/batch-position';
import {BatchOperationCertificateService} from '../../batch-operation/batch-operation-certificate/batch-operation-certificate.service';
import {MarkupGroupService} from '../../markup-group/markup-group.service';
import {MarkupGroup} from '../../markup-group/markup-group';
import {environment} from '../../../environments/environment';
import {AppState} from '../../app-state.service';
import {AuthService} from '../../auth/auth.service';
import {ErrorHandler} from '../../shared/errors/error-handler';
import {MapPositionStorageUnit} from '../map-position/map-position-storage-unit';
import {MapPositionLayer} from '../map-position/map-position-layer';
import {Notification} from '../../shared/notification';
import {MapPositionsService} from '../map-position/map-positions.service';
import {MapRealtimeServerService} from './map-realtime-server.service';
import {MapRealtimeService} from './map-realtime.service';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {TimerObservable} from 'rxjs/observable/TimerObservable';
import {Subscription} from 'rxjs/Rx';
import {BatchOperationCertificate} from 'app/batch-operation/batch-operation-certificate/batch-operation-certificate';
import {MapPosition} from "../map-position/map-position";
import {ClassificationVersion} from "../../classification/classification-version";
import {ClassificationService} from "../../classification/classification.service";

@Component({
  selector: 'app-map-realtime',
  templateUrl: './map-realtime.component.html',
  providers: [MapPositionsService]
})
export class MapRealtimeComponent implements OnInit, OnDestroy {

  storageUnitSyncSubscription: Subscription;
  refreshingMap: boolean = false;

  constructor(
    private auth: AuthService,
    private route: ActivatedRoute,
    private service: MapRealtimeService,
    private positionsService: MapPositionsService,
    private markupGroupService: MarkupGroupService,
    private batchOperationCertificateService: BatchOperationCertificateService,
    private batchPositionService: BatchPositionService,
    private classificationService: ClassificationService,
    private server: MapRealtimeServerService,
    private errorHandler: ErrorHandler,
    private appState: AppState,
  ) { }

  get positions() {
    return this.positionsService.positions;
  }

  ngOnInit() {
    this.appState.hideMenu();
    Notification.clearErrors();
    this.route.data.forEach((data: {
      layers: Array<MapPositionLayer>,
      storageUnits: Array<MapPositionStorageUnit>,
      markupGroups: Array<MarkupGroup>,
      batchOperationCertificates: Array<BatchOperationCertificate>,
      batchPositions: Array<BatchPosition>,
      classifications: Array<ClassificationVersion>
    }) => {
      this.positionsService.positions = new Map<string, MapPosition>();
      data.layers.forEach((layer) => {
        layer.mapPositions.forEach( mp => {
          this.positionsService.positions.set(mp.stackId, mp);
        });
      });
      this.service.refreshSyncDate(this.auth.accessToken.warehouse.id, true);
      this.positionsService.addStorageUnits(data.storageUnits);
      this.positionsService.addMarkupGroups(data.markupGroups || []);
      this.positionsService.refreshBatchPositions(data.batchPositions);
      this.positionsService.addBatchOperationCertificates(data.batchOperationCertificates || []);
      this.positionsService.addClassificationVersions(data.classifications || []);

      this.startStorageUnitsSync();
    });
  }

  ngOnDestroy() {
    if (this.storageUnitSyncSubscription && !this.storageUnitSyncSubscription.closed) {
      this.storageUnitSyncSubscription.unsubscribe();
    }
  }

  public startStorageUnitsSync() {
    if (this.storageUnitSyncSubscription) {
      return;
    }
    let interval = environment.REFRESH_INTERVAL_MAP;
    this.storageUnitSyncSubscription = TimerObservable.create(interval, interval).subscribe(() => {
      this.refreshingMap = true;
      let warehouseId = this.auth.accessToken.warehouse.id;
      let syncDate = this.service.firstSyncDateByWarehouse[warehouseId];

      Promise.all([
        this.server.syncStorageUnitsByWarehouse(warehouseId, syncDate),
        this.markupGroupService.sync(warehouseId, null),
        this.batchOperationCertificateService.sync(warehouseId, syncDate),
        this.batchPositionService.listActual(),
        //this.classificationService.sync(warehouseId, syncDate)
      ]).then((responses) => {
        this.positionsService.syncStorageUnits(responses[0]);
        this.positionsService.syncMarkupGroups(responses[1]);
        this.positionsService.refreshBatchPositions(responses[3]);
        this.positionsService.syncBatchOperationCertificates(responses[2]);
        //this.positionsService.syncClassificationVersions(responses[4]);

        this.refreshingMap = false;
      })
        .catch((error) => this.handleError(error));
    });
  }

  private handleError(error) {
    this.errorHandler.fromServer(error);
  }

}
