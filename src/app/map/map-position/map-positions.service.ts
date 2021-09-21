import { EventEmitter, Injectable } from '@angular/core';

import { MapPosition } from './map-position';
import { MapPositionStorageUnit } from './map-position-storage-unit';
import { MapPositionFilter } from './map-position-filter';
import {MarkupGroup} from "../../markup-group/markup-group";
import {StorageUnitBatch} from "../../storage-unit/storage-unit-batch";
import {BatchPosition} from "../../batch/batch-position/batch-position";
import {BatchOperationCertificate} from "../../batch-operation/batch-operation-certificate/batch-operation-certificate";
import {BatchOperation} from "../../batch-operation/batch-operation";
import {Certificate} from "../../certificate/certificate";
import {ClassificationVersion} from "../../classification/classification-version";
import {ClassificationItem} from "../../classification/classification-item";
import {ClassificationType} from "../../classification/classification-type";

@Injectable()
export class MapPositionsService {
  public positionSelected: EventEmitter<void> = new EventEmitter<void>(false);

  public positions: Map<string, MapPosition> = new Map<string, MapPosition>();
  public storageUnits: Map<string, MapPositionStorageUnit> = new Map<string, MapPositionStorageUnit>();
  public markupGroups: Map<string, MarkupGroup> = new Map<string, MarkupGroup>();
  public batchPositions: Map<string, MapPositionStorageUnit> = new Map<string, MapPositionStorageUnit>();
  public batchOperationCertificates: Map<string, Array<BatchOperation>> = new Map<string, Array<BatchOperation>>();
  public certificatesBatchOperations: Map<string, Array<Certificate>> = new Map<string, Array<Certificate>>();
  public sampleClassificationVersions: Map<string, ClassificationVersion> = new Map<string, ClassificationVersion>();
  public classificationsTypes: Map<string, ClassificationType> = new Map<string, ClassificationType>();
  public certificates: Array<Certificate> = [];
  public storageUnitsDetailed: Array<MapPositionStorageUnit>;

  public markupGroupFilter = null;

  constructor() { }

  private static sortMarkupGroup(markupGroups: Array<MarkupGroup>){
    markupGroups.sort((a: MarkupGroup, b: MarkupGroup) => {
      let aPriority = a.orderPriority;
      let bPriority = b.orderPriority;

      if (aPriority !== bPriority) {
        return aPriority - bPriority;
      }

      return a.label.localeCompare(b.label);
    });
    return markupGroups;
  }

  private static matchInclude(searchable: string, search: string) {
    if (!search) {
      return true;
    }

    if (!searchable && !search) {
      return true;
    }

    if (!searchable) {
      return false;
    }

    return searchable.toUpperCase().includes(search.toUpperCase());
  }

  private static matchEquals(searchable: string, search: string) {
    if (!search) {
      return true;
    }

    if (!searchable && !search) {
      return true;
    }

    if (!searchable) {
      return false;
    }

    return searchable.toUpperCase() === search.toUpperCase();
  }

  private static matchBetween(searchable: number, from: number, to: number) {
    if (!from && !to) {
      return true;
    }

    if ((from || to) && !searchable) {
      return false;
    }

    if (from && to) {
      if (searchable >= from &&
        searchable <= to) {
        return true;
      }
    }

    if (from && !to) {
      if (searchable >= from) {
        return true;
      }
    }

    if (!from && to) {
      if (searchable <= to) {
        return true;
      }
    }
  }

  addMarkupGroups(markupGroups: Array<MarkupGroup>) {

    if(!markupGroups)
      return;

    this.markupGroups.forEach(mg => {
      if(mg.markedPositionsStacks) {
        mg.markedPositionsStacks.forEach(stackId => {
          if (this.positions.get(stackId))
            this.positions.get(stackId).clearColor();
        });
      }
      if(mg.markedStorageUnits) {
        mg.markedStorageUnits.forEach(suId => {
          if (this.storageUnits.get(suId))
            this.storageUnits.get(suId).clearColor();
        });
      }
    });

    MapPositionsService.sortMarkupGroup(markupGroups).forEach( mg => {
      mg.selected = true;
      this.markupGroups.set(mg.id, mg);
      if(mg.markedPositionsStacks) {
        mg.markedPositionsStacks.forEach(stackId => {
          if (this.positions.get(stackId))
            this.positions.get(stackId).setColor(mg.color);
        });
      }
      if(mg.markedStorageUnits) {
        mg.markedStorageUnits.forEach(suId => {
          if (this.storageUnits.get(suId))
            this.storageUnits.get(suId).setColor(mg.color);
        });
      }
    } );

  }

  syncMarkupGroups(markupGroups: Array<MarkupGroup>) {

    if(!markupGroups)
      return;

    this.markupGroups.forEach(mg => {
      if(mg.markedPositionsStacks) {
        mg.markedPositionsStacks.forEach(stackId => {
          if (this.positions.get(stackId))
            this.positions.get(stackId).clearColor();
        });
      }
      if(mg.markedStorageUnits) {
        mg.markedStorageUnits.forEach(suId => {
          if (this.storageUnits.get(suId))
            this.storageUnits.get(suId).clearColor();
        });
      }
    });

    markupGroups.forEach(mg => {
      if(mg.deletedDate){
        mg.selected = false;
        this.markupGroups.delete(mg.id);
      }else{
        let oldMg = this.markupGroups.get(mg.id);
        if(oldMg){
          mg.selected = oldMg.selected;
        } else {
          mg.selected = true;
        }
        this.markupGroups.set(mg.id, mg);
      }
    });

    MapPositionsService.sortMarkupGroup(Array.from(this.markupGroups.values())).forEach( mg => {
      this.markupGroups.set(mg.id, mg);
      if(mg.selected){
        if(mg.markedPositionsStacks) {
          mg.markedPositionsStacks.forEach(stackId => {
            if (this.positions.get(stackId))
              this.positions.get(stackId).setColor(mg.color);
          });
        }
        if(mg.markedStorageUnits) {
          mg.markedStorageUnits.forEach(suId => {
            if (this.storageUnits.get(suId))
              this.storageUnits.get(suId).setColor(mg.color);
          });
        }
      }
    } );

  }

  markupGroupAllSelected(selected: boolean){
    MapPositionsService.sortMarkupGroup(Array.from(this.markupGroups.values())).forEach( mg => {
      mg.selected = selected;
      if(mg.markedPositionsStacks) {
        mg.markedPositionsStacks.forEach(stackId => {

          let position = this.positions.get(stackId);
          if(position) {
            position.clearColor();
            if (mg.selected)
              position.setColor(mg.color);
          }
        });
      }
      if(mg.markedStorageUnits) {
        mg.markedStorageUnits.forEach(suId => {

          let storageUnit = this.storageUnits.get(suId);
          if(storageUnit) {
            storageUnit.clearColor();
            if (mg.selected)
              storageUnit.setColor(mg.color);
          }
        });
      }
    } );
  }

  refreshMarkupGroupsColors(){
    MapPositionsService.sortMarkupGroup(Array.from(this.markupGroups.values())).forEach( mg => {
      if(mg.markedPositionsStacks) {
        mg.markedPositionsStacks.forEach(stackId => {
          this.positions.get(stackId).clearColor();
          if (mg.selected)
            this.positions.get(stackId).setColor(mg.color);
        });
      }
    } );
  }

  addClassificationVersions(classificationVersions: Array<ClassificationVersion>){
    if(!classificationVersions)
      return;

    classificationVersions.forEach(cv => {
      this.sampleClassificationVersions.set( cv.sample.id, cv);
    });
  }

  syncClassificationVersions(classificationVersions: Array<ClassificationVersion>){
    if(!classificationVersions)
      return;

    classificationVersions.forEach( cv => {
      if(cv.version != this.sampleClassificationVersions.get(cv.sample.id).version){
        this.sampleClassificationVersions.set(cv.sample.id, cv);
      }
    });
  }

  addStorageUnits( storageUnits: Array<MapPositionStorageUnit>) {
    if(!storageUnits)
      return;

    storageUnits.forEach(su => {
      let receiving = false;
      if(su.storageUnitBatches && su.storageUnitBatches.length > 0){
        receiving = su.storageUnitBatches
          .map( sub => sub.batch.status !== 'RC' && sub.batch.status !== 'C' )
          .reduce((s1,s2) => s1 || s2, false);
      }

      this.positions.get(su.stackId).bagCount += 1;
      su.clearColor();
      this.positions.get(su.stackId).clearColor();
      if(receiving) {
        su.setColor('#686651');
        this.positions.get(su.stackId).setColor('#686651');
      }
      this.storageUnits.set(su.id, su);
    });

  }

  syncStorageUnits( storageUnits: Array<MapPositionStorageUnit>) {

    if(!storageUnits)
      return;

    storageUnits.forEach( su => {
      if(this.storageUnits.get(su.id))
        this.positions.get(this.storageUnits.get(su.id).stackId).bagCount -= 1;

      if(!su.deletedDate) {
        let receiving = false;
        if(su.storageUnitBatches && su.storageUnitBatches.length > 0){
          receiving = su.storageUnitBatches
            .map( sub => sub.batch.status !== 'RC' && sub.batch.status !== 'C' )
            .reduce((s1,s2) => s1 || s2, false);
        }
        su.clearColor();
        this.positions.get(su.stackId).clearColor();
        if(receiving) {
          su.setColor('#686651');
          this.positions.get(su.stackId).setColor('#686651');
        }
        this.positions.get(su.stackId).bagCount += 1;
        this.storageUnits.set(su.id, su);
      }else {
        this.storageUnits.delete(su.id);
      }
    } );
  }

  addBatchOperationCertificates( batchOperationCertificate: Array<BatchOperationCertificate>) {
    if(!batchOperationCertificate)
      return;

    batchOperationCertificate.forEach(boc => {
      if(!this.batchOperationCertificates.get(boc.certificate.id))
        this.batchOperationCertificates.set(boc.certificate.id, []);

      if(!this.certificatesBatchOperations.get(boc.batchOperation.id))
        this.certificatesBatchOperations.set(boc.batchOperation.id, []);

      if(!this.certificates.find(cert => cert.id === boc.certificate.id))
        this.certificates.push(boc.certificate);

      this.batchOperationCertificates.get(boc.certificate.id).push(boc.batchOperation);
      this.certificatesBatchOperations.get(boc.batchOperation.id).push(boc.certificate);
    });

  }

  syncBatchOperationCertificates( batchOperationCertificate: Array<BatchOperationCertificate>) {

    if(!batchOperationCertificate)
      return;

    batchOperationCertificate.forEach(boc => {
      if (!boc.deletedDate){
        if(!this.batchOperationCertificates.get(boc.certificate.id))
          this.batchOperationCertificates.set(boc.certificate.id, []);

        if(!this.certificatesBatchOperations.get(boc.batchOperation.id))
          this.certificatesBatchOperations.set(boc.batchOperation.id, []);

        this.batchOperationCertificates.get(boc.certificate.id).push(boc.batchOperation);
        this.certificatesBatchOperations.get(boc.batchOperation.id).push(boc.certificate);
      } else {
        this.batchOperationCertificates.set(boc.certificate.id,
          this.batchOperationCertificates.get(boc.certificate.id).filter(bo => bo.id !== boc.batchOperation.id));

        this.certificatesBatchOperations.set(boc.batchOperation.id,
          this.certificatesBatchOperations.get(boc.batchOperation.id).filter(bo => bo.id !== boc.batchOperation.id));
      }
    });
  }

  refreshBatchPositions(batchPositions: Array<BatchPosition>) {

    this.batchPositions.forEach(bp => {
      this.positions.get(bp.stackId).bagCount -= 1;
    });

    this.batchPositions = new Map<string, MapPositionStorageUnit>();

    batchPositions.forEach((batchPosition) => {
      this.positions.get(batchPosition.stackId).bagCount += 1;

      let mapPosition = this.positions.get(batchPosition.stackId);

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

      this.batchPositions.set(batchPosition.id, mapPositionStorageUnit);
    });
  }

  get positionsToDisplay() {
    if (!this.positions) {
      return [];
    }

    return Array.from(this.positions.values())
      .filter(p => !p.hidden)
      .filter(p => p.x > 0 && p.y > 0)
      .filter(p => !p.deletedDate);
  }

  get classTypesAndValues(){
    let itensValues = new Map<string, Array<string>>();

    this.sampleClassificationVersions.forEach( scv => {
      scv.items.forEach(it => {
        /*let found = false;

        Array.from(itensValues.keys()).forEach(item => {
          if (item.id === it.classificationType.id)
            found = true;
        });*/
        if(it.classificationType.showOnMapFilter){
          if (itensValues.has(it.classificationType.id)){
            if(it.classificationType.type !== ClassificationType.INTERVAL){
              if(itensValues.get(it.classificationType.id).indexOf(it.value) < 0){
                itensValues.get(it.classificationType.id).push(it.value);
                itensValues.get(it.classificationType.id).sort((a,b)=> {
                  if (a > b) return 1
                  else if (a === b) return 0
                  else return -1;
                });
              }
            }
          }else{
            if(it.classificationType.type !== ClassificationType.INTERVAL){
              itensValues.set(it.classificationType.id, [it.value]);
            } else {
              itensValues.set(it.classificationType.id, []);
            }
            this.classificationsTypes.set(it.classificationType.id, it.classificationType);
          }
        }

      })

    })
    return itensValues;
  }

  selectPositionFrom(position: MapPosition) {
    this.positions.forEach((p) => {
      p.selectedFrom = false;
      p.highlighted = false;
    });
    if (position) {
      this.positions.get(position.stackId).selected = true;
      position.selectedFrom = true;
    }
  }

  selectPosition(position: MapPosition) {
    this.positions.forEach((p) => {
      p.selected = false;
      p.selectedFrom = false;
    });
    if (position) {
      this.positions.get(position.stackId).selected = true;
      position.selected = true;
    }
    this.refreshStorageUnitsDetailed();
    this.positionSelected.emit();
  }

  selectStorageUnit(storageUnit: MapPositionStorageUnit) {
    this.positions.forEach((p) => {
      p.selected = false;
    });
    this.storageUnits.forEach((su) => {
      su.selected = false;
    });
    this.storageUnitsDetailed.forEach((su) => {
      su.selected = false;
    });
    if (storageUnit) {
      storageUnit.selected = true;
      this.storageUnits.get(storageUnit.id).selected = true;
      this.positions.get(storageUnit.stackId).selected = true;
    }
  }

  search(filter: MapPositionFilter) {
    this.selectPosition(null);
    this.hightlight(filter);
    this.refreshStorageUnitsDetailed();
  }

  clearSearch() {
    this.markupGroupFilter = null;
    this.selectPosition(null);
    this.hightlight(null);
    this.refreshStorageUnitsDetailed();
  }

  private refreshStorageUnitsDetailed() {
    this.storageUnitsDetailed = [];

    let selectedPositionsIds: Array<string> = [];

    this.positions.forEach(pos => {
      if(pos.selected)
        selectedPositionsIds.push(pos.stackId);
    });

    this.storageUnits.forEach( su => {
      su.selectedForMarkupGroup = false;
      su.selected = false;
      if(selectedPositionsIds.indexOf(su.stackId) > -1 || su.highlighted ){
        this.storageUnitsDetailed.push(su);
      }
    });

    this.batchPositions.forEach( su => {
      su.selectedForMarkupGroup = false;
      su.selected = false;
      if(selectedPositionsIds.indexOf(su.stackId) > -1 || su.highlighted ){
        this.storageUnitsDetailed.push(su);
      }
    });

    MapPositionsService.sortMarkupGroup(Array.from(this.markupGroups.values())).forEach( mg => {
      this.storageUnitsDetailed.forEach(su => {
        if( mg.markedStorageUnits.indexOf(su.id) > -1 ){
          su.setColor(mg.color);
        }
      });
    });
  }

  private matchFilter(filter: MapPositionFilter, storageUnit: MapPositionStorageUnit) {
    if (!MapPositionsService.matchInclude(storageUnit.clientName, filter.clientName)) {
      return false;
    }

    if (!MapPositionsService.matchInclude(storageUnit.batchOperationCode, filter.batchOperationCode)) {
      return false;
    }

    if (!MapPositionsService.matchInclude(storageUnit.batchCode, filter.batchCode)) {
      return false;
    }

    if (!MapPositionsService.matchEquals(storageUnit.tagCode, filter.tagCode)) {
      return false;
    }

    if (!MapPositionsService.matchInclude(
      storageUnit.storageUnitBatches &&
      storageUnit.storageUnitBatches[0] &&
      storageUnit.storageUnitBatches[0].batch &&
      storageUnit.storageUnitBatches[0].batch.refClient, filter.refClient)) {
      return false;
    }

    if (!MapPositionsService.matchInclude(storageUnit.fullPosition, filter.fullPosition)) {
      return false;
    }

    if (filter.contaminant && !storageUnit.contaminant) {
      return false;
    }

    if (filter.coffeeType && storageUnit.contaminant) {
      return false;
    }

    if (filter.markupGroupId) {
      this.markupGroupFilter = filter.markupGroupId;
      if (!this.markupGroups.get(filter.markupGroupId).markedStorageUnits.some( suId => suId === storageUnit.id )) {
        return false;
      }
    } else {
      this.markupGroupFilter = null;
    }

    if (filter.certificateId) {
      //let certificateFound = Array.from(this.batchOperationCertificates.keys()).find( cert => cert.id === filter.certificateId);
      let boFound = this.batchOperationCertificates.get(filter.certificateId);

      if(!boFound || boFound.length == 0){
        return false
      }

      if (!storageUnit.storageUnitBatches.some(sub => !!boFound.find(bo => bo.batchOperationCode === sub.batch.batchOperation.batchOperationCode) )) {
        return false;
      }
    }

    if (filter.itemType){
      let itemType = this.classificationsTypes.get(filter.itemType);
      let found = false;
      storageUnit.sampleIdList.forEach(sId => {
        let classVer = this.sampleClassificationVersions.get(sId)

        if(classVer != null){
          classVer.items.forEach(classIt => {
            if (itemType.id === classIt.classificationType.id){
              if (itemType.type === ClassificationType.STRING){
                if (!MapPositionsService
                  .matchInclude(classIt.value, filter.itemValueString)) {
                  return false;
                }
              }
              if(itemType.type === ClassificationType.ENUMERATOR){
                if (!MapPositionsService
                  .matchEquals(classIt.value, filter.itemValueEnum)) {
                  return false;
                }
              }
              if(itemType.type === ClassificationType.INTERVAL){
                if (!MapPositionsService
                  .matchBetween(classIt.valueInNumber,
                    filter.itemValueIntervalMinNumber,
                    filter.itemValueIntervalMaxNumber
                    )) {
                  return false;
                }
              }
              found = true;
            }
          });
        }

      });

      if(!found)
        return false;

    }

    return true;
  }

  private hightlight(filter: MapPositionFilter) {
    this.positions.forEach((p) => p.highlighted = false);
    this.storageUnits.forEach((su) => su.highlighted = false);

    if (!filter || filter.isEmpty) {
      return;
    }

    this.storageUnits.forEach( su => {
      if (this.matchFilter(filter, su)) {
        su.highlighted = true;
        this.positions.get(su.stackId).highlighted = true;
      }
    })
  }
}
