import { BatchOperationCertificateService } from '../../batch-operation/batch-operation-certificate/batch-operation-certificate.service';
import { Certificate } from '../../certificate/certificate';
import { MapHistoryLog } from './map-history-log/map-history-log';
import { MapPosition } from '../map-position/map-position';
import { MapPositionsService } from '../map-position/map-positions.service';
import { AuthService } from '../../auth/auth.service';
import { MapHistoryServerService } from './map-history-server.service';
import { MapPositionLayer } from '../map-position/map-position-layer';
import { MapHistory } from './map-history';
import { Injectable } from '@angular/core';
import { BatchOperationCertificate } from 'app/batch-operation/batch-operation-certificate/batch-operation-certificate';
import { PositionType } from '../../position/position-type';
import {MapPositionStorageUnit} from "../map-position/map-position-storage-unit";

@Injectable()
export class MapHistoryService {

  loading: boolean;
  history: MapHistory;
  //batchOperationCertificates: Array<BatchOperationCertificate> = [];

  constructor(
    private auth: AuthService,
    private positionsService: MapPositionsService,
    private serverService: MapHistoryServerService,
    private batchOperationCertificateService: BatchOperationCertificateService,
  ) { }

  refresh(date?: number) {
    if (!date) {
      this.history = new MapHistory();
      this.selectLog(null);
      return;
    }

    this.loading = true;

    Promise.all([
      this.serverService.find(this.auth.accessToken.warehouse.id, date),
      this.batchOperationCertificateService.listAtEndOfTheDay(this.auth.accessToken.warehouse.id, date),
    ]).then((responses) => {
      this.history = responses[0];
      this.positionsService.addBatchOperationCertificates(<any>responses[1] || []);
      this.selectLog(null);

      this.loading = false;
    });
  }

  selectLog(log: MapHistoryLog) {
    this.history.logs.forEach((l) => {
      l.selected = false;
    });
    if (log) {
      log.selected = true;
      this.organizeStorageUnitsInsidePositions(log.logDate);
      if (log.mapPositionTo) {
        this.positionsService.selectPosition(log.mapPositionTo);
      }

      // When select a position, it clears other markers, so position from should
      // be the last
      if (log.mapPositionFrom) {
        this.positionsService.selectPositionFrom(log.mapPositionFrom);
      }else {
        this.positionsService.selectPositionFrom(null);
      }

    }else {
      this.organizeStorageUnitsInsidePositions();
      this.positionsService.selectPosition(null);
    }
  }

  organizeStorageUnitsInsidePositions(timeOfTheDay?: number) {
    this.organizeInitialStorageUnitsInsidePosition();
    if (timeOfTheDay) {
      this.realocateStorageUnitsBasedOnLogs(timeOfTheDay);
    }
  }

  /*associateCertificatesWithStorageUnits(positions: Array<MapPosition>) {
    const clearFromStorageUnits = () => {
      positions.forEach(p => {
        p.mapPositionStorageUnits.forEach(su => {
          su.certificates = [];
        });
      });
    };

    const associate = (batchOperationCertificates: Array<BatchOperationCertificate>, positions: Array<MapPosition>) => {
      positions.forEach(position => {
        position.mapPositionStorageUnits.forEach(storageUnit => {
          let matches = batchOperationCertificates.filter(boc => {
            return boc.batchOperation.batchOperationCode === storageUnit.batchOperationCode;
          }).map(boc => boc.certificate);

          if (matches && matches.length) {
            storageUnit.certificates = matches;
            storageUnit.certificates.sort((a: Certificate, b: Certificate) => {
              return a.name.localeCompare(b.name);
            });
          }
        });
      });
    };

    const batchOperationCertificates = this.batchOperationCertificates.slice();
    clearFromStorageUnits();
    associate(batchOperationCertificates, positions);
  }*/

  private realocateStorageUnitsBasedOnLogs(timeOfTheDay: number) {

    let logsUntilTime = this.history.logs.filter((log) => log.logDate <= timeOfTheDay);

    //this.positionsService.storageUnits = new Map<string, MapPositionStorageUnit>();
    this.positionsService.addStorageUnits(logsUntilTime.map(log => log.storageUnit));

    /*logsUntilTime.forEach((log) => {
      if (log.mapPositionFrom) {
        let positionFrom =  positions.find((p) => {
          return p.positionId === log.mapPositionFrom.positionId
                && p.stackId === log.mapPositionFrom.stackId;
        });
        positionFrom.mapPositionStorageUnits = positionFrom.mapPositionStorageUnits.filter((storageUnit) => storageUnit.tagCode !== log.storageUnit.tagCode);
      }

      let positionTo =  positions.find((p) => {
        return !!p
          && !!log.mapPositionTo
          && p.positionId === log.mapPositionTo.positionId
          && p.stackId === log.mapPositionTo.stackId;
      });

      if (!positionTo) {
        return;
      }

      log.storageUnit.positionCode = positionTo.positionCode;
      log.storageUnit.positionName = positionTo.positionName;
      if (positionTo.stackId) {
        log.storageUnit.stackCode = positionTo.stackCode;
      }
      //positionTo.mapPositionStorageUnits.push(log.storageUnit);
    });*/

    //this.hidePositionsWithOtherTypesAtSameGroup(positions);
  }

  private organizeInitialStorageUnitsInsidePosition() {

    // Clear previous storageUnits
    this.positionsService.storageUnits = new Map<string, MapPositionStorageUnit>();

    this.positionsService.positions.forEach((position) => {
      position.clearColor();
      position.bagCount = 0;
    });

    // Alocate snapshot storageUnits
    this.positionsService.addStorageUnits(this.history.snapshot);

  }

  /*hidePositionsWithOtherTypesAtSameGroup(positions: Array<MapPosition>) {
    positions.forEach(position => position.hidden = false);

    if (!this.auth.accessToken.warehouse.storageTypeSacaria) {
      positions.filter(p => p.type === 'SC').forEach(position => position.hidden = true);
    }

    if (!this.auth.accessToken.warehouse.storageTypeBigBag) {
      positions.filter(p => p.type === 'A').forEach(position => position.hidden = true);
    }

    let groupsWithBigBags = positions
      .filter(position => {
        return position.type === PositionType.ALA.code
          && position.mapPositionStorageUnits
          && position.mapPositionStorageUnits.length
      })
      .map(position => position.groupId);

    let groupsWithSacaria = positions
      .filter(position => {
        return position.type === PositionType.SACARIA.code
          && position.mapPositionStorageUnits
          && position.mapPositionStorageUnits.length
      })
      .map(position => position.groupId);

      positions
        .filter((position) => {
          return groupsWithBigBags.includes(position.groupId)
            && position.type === PositionType.SACARIA.code;
        })
        .forEach(position => position.hidden = true);

      positions
        .filter((position) => {
          return groupsWithSacaria.includes(position.groupId)
            && position.type === PositionType.ALA.code;
        })
        .forEach(position => position.hidden = true);
  }*/
}
