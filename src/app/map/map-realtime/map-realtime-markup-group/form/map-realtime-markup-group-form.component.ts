import { NumberHelper } from '../../../../shared/globalization';
import { MapRealtimeService } from '../../map-realtime.service';
import { StorageUnit } from '../../../../storage-unit/storage-unit';
import { MapPositionsService } from '../../../map-position/map-positions.service';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Http } from '@angular/http';
import { AuthService } from '../../../../auth/auth.service';
import { MarkupGroupBatch } from '../../../../markup-group/batch/markup-group-batch';
import { MarkupGroup } from '../../../../markup-group/markup-group';
import { MarkupGroupType } from '../../../../markup-group/markup-group-type';
import { MarkupGroupService } from '../../../../markup-group/markup-group.service';
import { MarkupGroupStorageUnit } from '../../../../markup-group/storage-unit/markup-group-storage-unit';
import { ErrorHandler } from '../../../../shared/errors/error-handler';
import { StorageUnitBatch } from 'app/storage-unit/storage-unit-batch';
import { UnitType } from '../../../../unit-type/unit-type';

@Component({
  selector: 'app-map-realtime-markup-group-form',
  templateUrl: 'map-realtime-markup-group-form.component.html'
})

export class MapRealtimeMarkupGroupFormComponent implements OnInit {
  @Output() close: EventEmitter<void> = new EventEmitter<void>(false);
  @Input() markupGroup: MarkupGroup;
  subitemsEditable = false;
  form: FormGroup;
  loading = false;

  constructor(
    private service: MarkupGroupService,
    private positionsService: MapPositionsService,
    private mapService: MapRealtimeService,
    private formBuilder: FormBuilder,
    private errorHandler: ErrorHandler,
    private auth: AuthService,
  ) {}

  ngOnInit() {
    this.subitemsEditable = MarkupGroupType.GENERIC.code === this.markupGroup.type;
    this.markupGroup = MarkupGroup.fromData(this.markupGroup);
    this.buildForm();
  }

  get noData() {
    return (!this.batches || !this.batches.length)
      && (!this.storageUnitsToDisplay || !this.storageUnitsToDisplay.length);
  }

  get batches() {
    return this.markupGroup.batches;
  }

  get storageUnitsToDisplay() {
    let toDisplay = this
      .markupGroup
      .storageUnits
      .filter((storageUnit, index) => {
        return this.markupGroup
          .storageUnits
          .some((su) => su.storageUnitBatch.storageUnit.id === storageUnit.storageUnitBatch.storageUnit.id);
      });

    toDisplay.sort((a, b) => {
      if (!a.storageUnitBatch.storageUnit.location) {
        return -1;
      }

      if (!b.storageUnitBatch.storageUnit.location) {
        return 1;
      }

      return a.storageUnitBatch.storageUnit.location.localeCompare(b.storageUnitBatch.storageUnit.location);
    });

    return toDisplay;
  }

  get storageUnits() {
    return this.markupGroup.storageUnits;
  }

  findBatchCodeOfStorageUnit(storageUnit: StorageUnitBatch) {
    /*let position = Array.from(this.positionsService
      .positions.values())
      .find((p) => p.mapPositionStorageUnits.some(mpsu => mpsu.id === storageUnit.id));

    if (!position) {
      return null;
    }*/

    let mapStorageUnit = Array.from(this.positionsService.storageUnits.values()).find(mpsu => mpsu.id === storageUnit.id);

    if (!mapStorageUnit) {
      return null;
    }

    return mapStorageUnit.batchCode;
  }

  excludeBatch(event: Event, batch: MarkupGroupBatch) {
    event.stopPropagation();
    let index = this.markupGroup.batches.findIndex(b => b.id === batch.id);
    if (index !== -1) {
      this.markupGroup.batches.splice(index, 1);
    }
  }

  excludeStorageUnit(event: Event, storageUnit: MarkupGroupStorageUnit) {
    event.stopPropagation();
    let index = this.markupGroup.storageUnits.findIndex(s => s.id === storageUnit.id);
    if (index !== -1) {
      this.markupGroup.storageUnits.splice(index, 1);
    }
  }

  buildForm() {
    this.form = this.formBuilder.group({
      'label': [ this.markupGroup.label || '', Validators.required ],
      'color': [ this.markupGroup.color || '#FF0000', Validators.required ],
    });
  }

  // downloadShipmentTruckLotAllocationReport() {

  //   this.loading = true;
  //   this.mapService.downloadShipmentTruckLotAllocationReport(this.markupGroup.id).then(() => {
  //     this.loading = false;
  //   }).catch(error => this.handleError(error));
  // }
  // downloadShipmentReportCsv() {
  //   this.loading = true;
  //   this.mapService.downloadShipmentReport(this.markupGroup.id).then(() => {
  //     this.loading = false;
  //   }).catch(error => this.handleError(error));
  // }

  downloadShipmentReport() {
    this.submit().then(() => {
      return this.mapService.downloadShipmentReport(this.markupGroup.id);
    })
    .then(() => this.loading = false)
    .catch(error => {
      // Ignora, erro de validação
    });
  }

  downloadShipmentDryHarborReport() {
    this.submit().then(() => {
      return this.mapService.downloadShipmentDryHarborReport(this.markupGroup.id);
    })
    .then(() => this.loading = false)
    .catch(error => {
      // Ignora, erro de validação
    });
  }

  handleError(error) {
    this.loading = false;
    return this.errorHandler.fromServer(error);
  }

  submit() {
    Object.keys(this.form.controls).forEach((key) => {
      this.form.controls[key].markAsDirty();
    });

    if (!this.form.valid) {
      return Promise.reject('invalid');
    }

    this.markupGroup.label = this.form.value.label;
    this.markupGroup.color = this.form.value.color;
    this.markupGroup.warehouse = this.auth.accessToken.warehouse;

    let saveMethod = this.service.saveLabelAndColor(this.markupGroup);

    if (this.subitemsEditable) {
      this.markupGroup.typeObject = MarkupGroupType.GENERIC;
      saveMethod = this.service.save(this.markupGroup);
    }

    this.loading = true;
    return saveMethod
      .then(mg => {
        if (mg) {
          if (this.markupGroup.storageUnits) {

            mg.markedPositionsStacks = [];
            mg.markedStorageUnits = [];

            this.markupGroup.storageUnits.forEach(mgsu => {
              this.positionsService.positions.get(mgsu.storageUnitBatch.storageUnit.stack.id).setColor(mg.color);
              mg.markedPositionsStacks.push(mgsu.storageUnitBatch.storageUnit.stack.id);
              mg.markedStorageUnits.push(mgsu.storageUnitBatch.storageUnit.id);
            });

            this.positionsService.storageUnitsDetailed.forEach(su => {
              if (su.selectedForMarkupGroup) {
                su.setColor(mg.color);
                this.positionsService.storageUnits.get(su.id).setColor(mg.color);
              }
            });

          }
          this.positionsService.markupGroups.set(mg.id, mg);
        }
        this.loading = false;
      })
      .catch(error => {
        this.loading = false;
        this.errorHandler.fromServer(error);
      });
  }

  submitAndClose() {
    return this.submit()
      .then(() => {
        (<any>jQuery)('.modal').modal('hide');
      })
      .catch((error) => {
        // Ignora, erro de validação
      });
  }

  get totalBatchQuantity() {
    if (!this.batches || !this.batches.length) {
      return 0;
    }

    return this.batches.map(b => b.quantity).reduce((a, b) => a + b, 0);
  }

  get totalBatchQuantityString() {
    return NumberHelper.toPTBR(this.totalBatchQuantity);
  }

  get totalStorageUnitKilos() {
    if (!this.storageUnitsToDisplay || !this.storageUnitsToDisplay.length) {
      return 0;
    }

    return this.storageUnitsToDisplay
      .filter(su => su.storageUnitBatch.unitType === UnitType.KG.code )
      .map(su => su.storageUnitBatch.quantity)
      .reduce((a, b) => a + b, 0);
  }

  get totalStorageUnitKilosString() {
    return NumberHelper.toPTBR(this.totalStorageUnitKilos);
  }

  get totalStorageUnitSacks() {
    if (!this.storageUnitsToDisplay || !this.storageUnitsToDisplay.length) {
      return 0;
    }

    return this.storageUnitsToDisplay
      .filter(su => su.storageUnitBatch.unitType === UnitType.SC.code )
      .map(su => su.storageUnitBatch.quantity)
      .reduce((a, b) => a + b, 0);
  }

  get totalStorageUnitSacksString() {
    return NumberHelper.toPTBR(this.totalStorageUnitSacks);
  }

}
