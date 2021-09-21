import { StorageUnitBatch } from '../../storage-unit/storage-unit-batch';
import { BatchPosition } from '../../batch/batch-position/batch-position';
import { Http, ResponseContentType, URLSearchParams } from '@angular/http';
import { Endpoints } from '../../endpoints';
import { Certificate } from '../../certificate/certificate';
import { MarkupGroup } from '../../markup-group/markup-group';
import { DateSyncService } from '../../date-sync/date-sync.service';
import { MapPosition } from '../map-position/map-position';
import { MapPositionStorageUnit } from '../map-position/map-position-storage-unit';
import { MapPositionLayer } from '../map-position/map-position-layer';
import { Injectable } from '@angular/core';
import { BatchOperationCertificate } from 'app/batch-operation/batch-operation-certificate/batch-operation-certificate';
import { PositionType } from '../../position/position-type';
import { AuthService } from '../../auth/auth.service';
import {MapPositionsService} from "../map-position/map-positions.service";

@Injectable()
export class MapRealtimeService {
  public firstSyncDateByWarehouse: any = {};
  //public markupGroups = [];
  //public batchOperationCertificates: Array<BatchOperationCertificate> = [];
  public markupGroupEditable: MarkupGroup;

  constructor(
    private dateSyncService: DateSyncService,
    private http: Http,
    private auth: AuthService,
  ) {}

  refreshSyncDate(warehouseId: string, firstRun = false) {
    return this.dateSyncService.serverDate().then((serverDate) => {

      if (firstRun) {
        // precaution time
        serverDate = +moment(serverDate).subtract(5, 'minutes');
      }

      this.firstSyncDateByWarehouse[warehouseId] = serverDate;
    });
  }

  // downloadShipmentTruckLotAllocationReport(markupGroupId: string): Promise<void> {
  //   let params = new URLSearchParams();
  //   params.append('markupGroupId', markupGroupId);
  //   return this.http.get(
  //       Endpoints.reportShipmentTruckLotAllocationURL,
  //       {
  //         search: params,
  //         responseType: ResponseContentType.Blob,
  //       }
  //     )
  //     .toPromise()
  //     .then(response => {
  //       let url = window.URL.createObjectURL(response.blob());
  //       window.open(url);
  //     });
  // }

  downloadShipmentReport(markupGroupId: string): Promise<void> {
    let params = new URLSearchParams();
    params.append('markupGroupId', markupGroupId);
    return this.http.get(
        Endpoints.reportShipmentURL,
        {
          search: params,
          responseType: ResponseContentType.Blob,
        }
      )
      .toPromise()
      .then(response => {
        let url = window.URL.createObjectURL(response.blob());
        window.open(url);
      });
  }

  downloadShipmentDryHarborReport(markupGroupId: string): Promise<void> {
    let params = new URLSearchParams();
    params.append('markupGroupId', markupGroupId);

    return this.http.get(
        Endpoints.reportShipmentDryHarborURL,
        {
          search: params,
          responseType: ResponseContentType.Blob,
        }
      )
      .toPromise()
      .then(response => {
        let url = window.URL.createObjectURL(response.blob());
        window.open(url);
      });
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

  /*refreshBatchPositionInsidePositions(
    positions: Array<MapPosition>,
    batchPositions: Array<BatchPosition>,
  ) {
    positions.forEach(position => {
      position.mapPositionStorageUnits = position.mapPositionStorageUnits.filter((mpsu) => !mpsu.batchOnly);
    });

    batchPositions.forEach((batchPosition) => {
      let mapPosition = positions.find((position) => {
        return position.positionId === batchPosition.position.id;
      });

      if (mapPosition) {
        const mapPositionStorageUnit = new MapPositionStorageUnit();
        mapPositionStorageUnit.positionId = batchPosition.position.id;
        mapPositionStorageUnit.positionCode = batchPosition.position.code;
        mapPositionStorageUnit.positionName = batchPosition.position.name;
        mapPositionStorageUnit.stackId = mapPosition.stackId;
        mapPositionStorageUnit.stackCode = mapPosition.stackCode;
        mapPositionStorageUnit.height = 1;
        mapPositionStorageUnit.storageUnitBatches = [new StorageUnitBatch(
          null,
          null,
          batchPosition.batch,
          batchPosition.batch.netWeight,
          batchPosition.batch.unitType,
        )];
        mapPositionStorageUnit.batchOnly = true;
        mapPosition.mapPositionStorageUnits.push(mapPositionStorageUnit);
      }
    });
    return positions;
  }*/

  /*removeStorageUnitsFromPositions(positions: Array<MapPosition>,
                                      storageUnits: Array<MapPositionStorageUnit>) {
    storageUnits.forEach((storageUnit) => {
      positions.forEach((position) => {
        let storageUnitFound = !!position.mapPositionStorageUnits.find((b) => b.id === storageUnit.id);
        if (storageUnitFound) {
          position.mapPositionStorageUnits = position.mapPositionStorageUnits
                                              .filter((mpb) => mpb.id !== storageUnit.id);
        }
      });
    });
    return positions;
  }*/


  /*deleteMarkupGroupFromMemory(id: string) {
    const index = this.markupGroups.findIndex(mg => mg.id === id);

    if (index !== -1) {
      this.markupGroups.splice(index, 1);
    }

    this.associateMarkupGroupsWithStorageUnits(positions);
  }*/

  /*updateMarkupGroupFromMemory(markupGroup: MarkupGroup, positions: Array<MapPosition>) {
    const index = this.markupGroups.findIndex(mg => mg.id === markupGroup.id);

    if (index === -1) {
      this.markupGroups.push(markupGroup);
    } else {
      this.markupGroups.splice(index, 1, markupGroup);
    }

    this.associateMarkupGroupsWithStorageUnits(positions);
  }*/

  /*syncBatchOperationCertificates(synceds: Array<BatchOperationCertificate>) {
    synceds.forEach((synced) => {
      const index = this.batchOperationCertificates.findIndex(mg => mg.id === synced.id);
      const inMemory = index !== -1;
      let deleted = synced.deletedDate;

      if (!inMemory && deleted) {
        return;
      }

      if (inMemory && deleted) {
        this.batchOperationCertificates.splice(index, 1);
        return;
      }

      if (!inMemory && !deleted) {
        this.batchOperationCertificates.push(synced);
        return;
      }

      if (inMemory && !deleted) {
        this.batchOperationCertificates.splice(index, 1, synced);
      }
    });
  }

  syncMarkupGroups(synceds: Array<MarkupGroup>) {
    synceds.forEach((synced) => {
      const index = this.markupGroups.findIndex(mg => mg.id === synced.id);
      const inMemory = index !== -1;
      const deleted = synced.deletedDate || synced.excludedFromMapAt;

      if (!inMemory && deleted) {
        return;
      }

      if (inMemory && deleted) {
        this.markupGroups.splice(index, 1);
        return;
      }

      if (!inMemory && !deleted) {
        synced.selected = true;
        this.markupGroups.push(synced);
        return;
      }

      if (inMemory && !deleted) {
        if (this.markupGroups[index].selected) {
          synced.selected = true;
        }

        this.markupGroups.splice(index, 1, synced);
      }
    });
  }*/

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
            return boc && boc.batchOperation && boc.batchOperation.batchOperationCode === storageUnit.batchOperationCode;
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
  }

  associateMarkupGroupsWithStorageUnits(positions: Array<MapPosition>) {
    const clearMarkupGroupFromStorageUnits = () => {
      positions.forEach(p => {
        p.mapPositionStorageUnits.forEach(su => {
          su.markupGroups = [];
        });
      });
    };

    const orderMarkupGroupsByPriority = (list: Array<MarkupGroup>) => {
      list.sort((a: MarkupGroup, b: MarkupGroup) => {
        let aPriority = a.orderPriority;
        let bPriority = b.orderPriority;

        if (aPriority !== bPriority) {
          return aPriority - bPriority;
        }

        return a.label.localeCompare(b.label);
      });

      list.reverse();
    };

    const associate = (markupGroups: Array<MarkupGroup>, positions: Array<MapPosition>) => {
      positions.forEach(position => {
        position.mapPositionStorageUnits.forEach(storageUnit => {
          let match = markupGroups.filter(mg => {
            return mg.batches.some(mgb => mgb.batch &&
              storageUnit.batchCode.indexOf(mgb.batch.batchCode) >= 0 ) ||
              mg.storageUnits.some(s => s.storageUnitBatch.storageUnit && s.storageUnitBatch.storageUnit.id === storageUnit.id);
          });

          if (match && match.length) {
            storageUnit.markupGroups = match;
          }
        });
      });
    };

    const markupGroups = this.markupGroups.slice();
    clearMarkupGroupFromStorageUnits();
    orderMarkupGroupsByPriority(markupGroups);
    associate(markupGroups, positions);
  }*/

}
