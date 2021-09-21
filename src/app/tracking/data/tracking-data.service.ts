import { UnavailableBatchWeight } from '../batch/unavailable-batch-weight';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../auth/auth.service';
import { DateSyncService } from '../../date-sync/date-sync.service';
import { Endpoints } from '../../endpoints';
import { TrackingStorageUnit } from '../storage-unit/tracking-storage-unit';
import { TrackingBatch } from '../batch/tracking-batch';
import { MapTrackingPosition } from '../map/map-tracking-position';
import { MapTrackingPositionLayer } from '../map/map-tracking-position-layer';
import { BatchSyncOrganizer } from './batch-sync-organizer';
import { PositionStorageUnitSyncOrganizer } from './position-storage-unit-sync-organizer';
import { Injectable } from '@angular/core';
import { Http, URLSearchParams } from '@angular/http';
import { TimerObservable } from 'rxjs/observable/TimerObservable';
import { Subscription } from 'rxjs/Rx';

@Injectable()
export class TrackingDataService {

  public storageUnits: Array<TrackingStorageUnit>;
  public positions: Array<MapTrackingPosition>;
  public batches: Array<TrackingBatch>;
  public unavailableBatchWeights: Array<UnavailableBatchWeight> = [];

  private firstSyncDateByWarehouse: any = {};
  private syncSubscription: Subscription;

  constructor(
    private http: Http,
    private auth: AuthService,
    private dateSyncService: DateSyncService,
  ) {}

  init() {
    return Promise.all([
      this.fetchPositions(),
      this.initialStorageUnitFetch(),
      this.initialBatchesFetch(),
      this.unavailableBatchWeightsFetch(),
    ]).then(() => {
      this.startSync();
      PositionStorageUnitSyncOrganizer.addStorageUnitsInsidePositions(this.positions, this.storageUnits);
      BatchSyncOrganizer.organize([], this.batches, this.storageUnits, this.unavailableBatchWeights);
    });
  }

  destroy() {
    if (this.syncSubscription && !this.syncSubscription.closed) {
      this.syncSubscription.unsubscribe();
    }
  }

  private unavailableBatchWeightsFetch() {
    return this.http.get(Endpoints.unavailableBatchWeightsUrl)
      .toPromise()
      .then(response => {
        this.unavailableBatchWeights = UnavailableBatchWeight.fromListData(
          response.json()
        );
      });
  }

  private fetchPositions(): Promise<Array<MapTrackingPosition>> {
    return this.http.get(Endpoints.mapPositionsUrl(this.auth.accessToken.warehouse.id))
      .toPromise()
      .then(response => {
        this.positions =
          MapTrackingPositionLayer
          .fromListData(response.json())
          .map(layer => {
            return layer.mapPositions;
          })
          .reduce((a, b) => {
            return a.concat(b);
          });
      });
  }

  private initialBatchesFetch() {
    return this.http.get(Endpoints.batchRealtimeUrl(this.auth.accessToken.warehouse.id) + '/all')
      .toPromise()
      .then(response => {
        this.batches = TrackingBatch.fromListData(
          response.json()
        );

        this.sortBatches();
      });
  }

  private initialStorageUnitFetch() {
    this.refreshSyncDate(true);
    return this.http.get(Endpoints.mapRealtimeUrl(this.auth.accessToken.warehouse.id) + '/all')
      .toPromise()
      .then(response => {
        this.storageUnits = TrackingStorageUnit.fromListData(
          response.json()
        );
      });
  }

  private startSync() {
    if (this.syncSubscription) {
      return;
    }

    let interval = environment.REFRESH_INTERVAL_MAP;
    this.syncSubscription = TimerObservable.create(interval, interval).subscribe(() => {
      this.syncStorageUnitFetch().catch(error => console.error(error));
      this.unavailableBatchWeightsFetch().then(() => {
        return this.syncBatchFetch();
      }).catch(error => console.error(error));
    });
  }

  private syncStorageUnitFetch() {
    let params = new URLSearchParams();
    let warehouseId = this.auth.accessToken.warehouse.id;
    let syncDate = this.firstSyncDateByWarehouse[warehouseId];

    if (!syncDate) {
      return Promise.reject('Ocorreu um erro ao sincronizar as storageUnits do servidor. A pesquisa inicial não foi realizada.');
    }

    params.append('syncDate', syncDate + '');

    return this.http
      .get(
        Endpoints.mapRealtimeSyncUrl(warehouseId) + '/all',
        { search: params }
      )
      .toPromise()
      .then(response => {
        let storageUnits = TrackingStorageUnit.fromListData(
          response.json()
        );

        PositionStorageUnitSyncOrganizer.organize(storageUnits, this.positions);
      });
  }

  private syncBatchFetch() {
    let params = new URLSearchParams();
    let warehouseId = this.auth.accessToken.warehouse.id;
    let syncDate = this.firstSyncDateByWarehouse[warehouseId];

    if (!syncDate) {
      return Promise.reject('Ocorreu um erro ao sincronizar os lotes do servidor. A pesquisa inicial não foi realizada.');
    }

    params.append('syncDate', syncDate + '');

    return this.http
      .get(
        Endpoints.batchRealtimeSyncUrl(warehouseId) + '/syncPaged/all',
        { search: params }
      )
      .toPromise()
      .then(response => {
        let syncedBatches = TrackingBatch.fromListData(
          response.json()
        );

        this.batches = BatchSyncOrganizer.organize(this.batches, syncedBatches, this.storageUnits, this.unavailableBatchWeights);
        this.sortBatches();
      });
  }

  private refreshSyncDate(firstRun = false) {
    return this.dateSyncService.serverDate().then((serverDate) => {
      if (firstRun) {
        // precaution time
        serverDate = +moment(serverDate).subtract(5, 'minutes');
      }

      this.firstSyncDateByWarehouse[this.auth.accessToken.warehouse.id] = serverDate;
    });
  }

  private sortBatches() {
    this.batches.sort((a, b) => {
      if (a.batchCode > b.batchCode) {
        return 1;
      }

      if (a.batchCode < b.batchCode) {
        return -1;
      }

      return 0;
    });
  }

}
