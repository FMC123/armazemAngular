import { StorageUnitBatch } from '../../../storage-unit/storage-unit-batch';
import { Tag } from '../../../tag/tag';
import { StorageUnit } from '../../../storage-unit/storage-unit';
import { MarkupGroupStorageUnit } from '../../../markup-group/storage-unit/markup-group-storage-unit';
import { MapPositionsService } from '../../map-position/map-positions.service';
import { MapPositionServerService } from '../../map-position/map-position-server.service';
import { ErrorHandler } from '../../../shared/errors/error-handler';
import { MarkupGroupService } from '../../../markup-group/markup-group.service';
import { Component, OnInit } from '@angular/core';

import { MarkupGroup } from '../../../markup-group/markup-group';
import { ModalManager } from '../../../shared/modals/modal-manager';
import { MapRealtimeService } from '../map-realtime.service';
import {Stack} from "../../../stack/stack";

@Component({
  selector: 'app-map-realtime-markup-group',
  templateUrl: 'map-realtime-markup-group.component.html'
})

export class MapRealtimeMarkupGroupComponent implements OnInit {

  collapsed = false;
  deleteIdConfirm: string;
  selected: MarkupGroup;
  editable: MarkupGroup;
  loading = false;

  constructor(
    private mapRealtimeService: MapRealtimeService,
    private markupGroupService: MarkupGroupService,
    private positionsService: MapPositionsService,
    private errorHandler: ErrorHandler,
  ) { }

  ngOnInit() { }

  get markupGroups() {
    if (this.positionsService.markupGroupFilter) {
      return Array.from(this.positionsService.markupGroups.values()).filter((i) => {
        return this.positionsService.markupGroupFilter === i.id;
      });
    }
    return Array.from(this.positionsService.markupGroups.values());
  }

  get emptyStorageUnits() {
    if (!this.positionsService.storageUnitsDetailed) {
      return true;
    }

    return !this.positionsService
      .storageUnitsDetailed
      .some((mapStorageUnit) => mapStorageUnit.selectedForMarkupGroup);
  }

  associateStorageUnitsWithoutSave(markupGroup: MarkupGroup) {
    (this.positionsService.storageUnitsDetailed || [])
      .filter((mapStorageUnit) => mapStorageUnit.selectedForMarkupGroup)
      .forEach((mapStorageUnit) => {
        const alreadyInList = markupGroup.storageUnits.some(mgs => mgs.storageUnitBatch.storageUnit.id === mapStorageUnit.id);

      if (!alreadyInList) {
        markupGroup.storageUnits.push(
          new MarkupGroupStorageUnit(null, new StorageUnitBatch(
              null,
              new StorageUnit(
                mapStorageUnit.id,
                new Tag(null, Number(mapStorageUnit.tagCode)),
                null,
                new Stack(mapStorageUnit.stackId)
              ),
              null,
              mapStorageUnit.initialWeight,
            )),
          );
      }
    });
  }

  associateStorageUnits(markupGroup: MarkupGroup) {
    this.associateStorageUnitsWithoutSave(markupGroup);

    this.loading = true;
    return this.markupGroupService.save(markupGroup).then(() => {
      this.positionsService.syncMarkupGroups([markupGroup]);
      this.loading = false;
    }).catch((error) => {
      this.errorHandler.fromServer(error);
      this.loading = false;
    });
  }

  /*get allMarkupGroupsSelected() {
    if (!this.positionsService.markupGroups) {
      return false;
    }

    this.positionsService
    return this.mapRealtimeService.markupGroups.every(mg => mg.selected);
  }*/

  /*set allMarkupGroupsSelected(value) {
    if (!this.mapRealtimeService.markupGroups) {
      return;
    }

    this.mapRealtimeService.markupGroups.forEach((mg) => {
      mg.selected = !!value;
    });
  }*/

  excludeResponseHandler(response: boolean) {
    if (response) {
      this.delete(this.deleteIdConfirm);
    }

    this.deleteIdConfirm = null;
  }

  delete(id: string) {
    this.loading = true;
    return this.markupGroupService.delete(id).then(() => {
      this.positionsService.markupGroups.get(id).deletedDate = (new Date()).getMilliseconds();
      this.positionsService.markupGroups.get(id).selected = false;
      this.positionsService.syncMarkupGroups([this.positionsService.markupGroups.get(id)]);
      this.loading = false;
    }).catch((error) => {
      this.errorHandler.fromServer(error);
      this.loading = false;
    });
  }

  edit(markupGroup: MarkupGroup) {
    this.mapRealtimeService.markupGroupEditable = markupGroup;
  }

  view(markupGroup: MarkupGroup) {
    this.mapRealtimeService.markupGroupEditable = markupGroup;
  }

  toggleMarkupGroupVisibility(markupGroup: MarkupGroup, e){
    this.positionsService.markupGroups.get(markupGroup.id).selected = e.target.checked;
    this.positionsService.refreshMarkupGroupsColors();
  }

  toggleAllMarkupGroupVisibility(e){
    this.positionsService.markupGroupAllSelected(e.target.checked);
  }

  create(event: Event) {
    event.stopPropagation();
    const markupGroup = new MarkupGroup();
    markupGroup.selected = true;
    this.associateStorageUnitsWithoutSave(markupGroup);
    this.mapRealtimeService.markupGroupEditable = markupGroup;
  }

}


