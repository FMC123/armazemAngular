import { Certificate } from '../../certificate/certificate';
import { MarkupGroup } from '../../markup-group/markup-group';
import { StorageUnitBatch } from '../../storage-unit/storage-unit-batch';
import { NumberHelper } from '../../shared/globalization';
import { PositionType } from './../../position/position-type';
import { MapPositionColor } from './map-position-color';
import { UnitType } from '../../unit-type/unit-type';

export class MapPositionStorageUnit {

  public color: MapPositionColor = new MapPositionColor();

  static fromListData(listData: Array<MapPositionStorageUnit>): Array<MapPositionStorageUnit> {
    return listData.map((data) => {
      return MapPositionStorageUnit.fromData(data);
    });
  }

  static fromData(data: MapPositionStorageUnit) {
    if (!data) return new this();
    let storageUnit = new this(
      data.id,
      data.positionId,
      data.positionCode,
      data.positionName,
      data.stackId,
      data.stackCode,
      data.height,
      data.tagCode,
      data.qualifiers,
      data.highlighted,
      data.selected,
      data.selectedFrom,
      data.selectedForMarkupGroup,
      data.deletedDate,
      data.storageUnitBatches,
      data.classZimPadraoCafe,
      data.classZimBebida,
      data.classZimQuebraAmostragem,
      /*data.markupGroups,*/
      data.contaminant,
      data.certificates,
      data.batchOnly,
      data.batchOperationId,
    );
    return storageUnit;
  }

  constructor(
    public id?: string,
    public positionId?: string,
    public positionCode?: string,
    public positionName?: string,
    public stackId?: string,
    public stackCode?: string,
    public height?: number,
    public tagCode?: string,
    public qualifiers?: string,
    public highlighted?: boolean,
    public selected?: boolean,
    public selectedFrom?: boolean,
    public selectedForMarkupGroup?: boolean,
    public deletedDate?: number,
    public storageUnitBatches?: Array<StorageUnitBatch>,
    public classZimPadraoCafe?: string,
    public classZimBebida?: string,
    public classZimQuebraAmostragem?: number,
    /*public markupGroups?: Array<MarkupGroup>,*/
    public contaminant?: boolean,
    public certificates?: Array<Certificate>,
    public batchOnly?: boolean,
    public batchOperationId?: string,
  ) {
    if (storageUnitBatches) {
      this.storageUnitBatches = StorageUnitBatch.fromListData(storageUnitBatches);
    } else {
      this.storageUnitBatches = [];
    }
  }

  get clientName() {
    if (!this.storageUnitBatches || !this.storageUnitBatches.length) {
      return null;
    }

    return this.storageUnitBatches
      .map(sub => sub.batch)
      .filter(b => !!b)
      .map(b => b.batchOperation)
      .filter(bo => !!bo)
      .map(bo => bo.owner)
      .filter(o => !!o)
      .map(o => o.person)
      .filter(p => !!p)
      .map(p => p.name)
      .filter(n => !!n)
      .join(', ');
  }

  get clientNameWithCode() {
    if (!this.storageUnitBatches || !this.storageUnitBatches.length) {
      return null;
    }

    return this.storageUnitBatches
      .map(sub => sub.batch)
      .filter(b => !!b)
      .map(b => b.batchOperation)
      .filter(bo => !!bo)
      .map(bo => bo.owner)
      .filter(o => !!o)
      .map(o => o.labelWithoutDocument)
      .join(', ');
  }

  get batchCode() {
    if (!this.storageUnitBatches || !this.storageUnitBatches.length) {
      return null;
    }

    return this.storageUnitBatches
      .map(sub => sub.batch)
      .filter(b => !!b)
      .map(b => b.batchCode)
      .filter(bc => !!bc)
      .join(', ');
  }

  get sampleIdList() {
    if (!this.storageUnitBatches || !this.storageUnitBatches.length) {
      return null;
    }

    return this.storageUnitBatches
      .map(sub => sub.batch)
      .filter(b => !!b)
      .map(b => b.sample.id)
      .filter(sid => !!sid);
  }

  get batchOperationCode() {
    if (!this.storageUnitBatches || !this.storageUnitBatches.length) {
      return null;
    }

    return this.storageUnitBatches
      .map(sub => sub.batch)
      .filter(b => !!b)
      .map(b => b.batchOperation)
      .filter(bo => !!bo)
      .map(bo => bo.batchOperationCode)
      .filter(n => !!n)
      .join(', ');
  }

  get batchesAndWeightsMinified() {
    if (!this.storageUnitBatches || !this.storageUnitBatches.length) {
      return '';
    }

    let output = this.storageUnitBatches.map((storageUnitBatch) => {
      let batchCode = storageUnitBatch.batch.batchCode;
      let weight = storageUnitBatch.quantity;
      let unitType = storageUnitBatch.unitType;

      if (unitType === 'SC') {
        return `${batchCode} (SC ${weight})`;
      } else {
        return `${batchCode} (KG ${NumberHelper.toPTBR(weight)})`;
      }
    });

    return output.join(', ');
  }

  batchesAndWeights(sacksInKilos) {
    if (!sacksInKilos) {
      return '';
    }

    if (!this.storageUnitBatches || !this.storageUnitBatches.length) {
      return '';
    }

    let output = this.storageUnitBatches.map((storageUnitBatch) => {
      let batchCode = storageUnitBatch.batch.batchCode;
      let weight = storageUnitBatch.quantity;
      let sacks = Math.floor(weight / sacksInKilos);
      let unitType = storageUnitBatch.unitType;

      if (unitType === 'SC') {
        return `${batchCode} - ${weight} SC`;
      } else {
        return `${batchCode} - KG ${NumberHelper.toPTBR(weight)} (${sacks} SC)`;
      }
    });

    return output.join(', ');
  }

  get initialWeight() {
    if (!this.storageUnitBatches || !this.storageUnitBatches.length) {
      return 0;
    }

    return this.storageUnitBatches.map(sub => sub.quantity).reduce((a, b) => a + b, 0);
  }

  get initialWeightString() {
    return NumberHelper.toPTBR(this.initialWeight);
  }

  get fullPosition() {
    return `${this.positionName ? this.positionName : this.positionCode} ${this.stackCode}/${this.height}`;
  }

  get fillDarkest() {
    this.adjustColor();
    return this.color.darkest;
  }

  get fill() {
    this.adjustColor();
    return this.color.fill;
  }

  get textFill() {
    this.adjustColor();
    return this.color.text;
  }

  /*get markupGroup() {
    if (!this.markupGroups) {
      return null;
    }

    let selecteds = this.markupGroups.filter(mg => mg.selected);

    if (!selecteds || !selecteds.length) {
      return null;
    }

    return selecteds[0];
  }*/

  get isSacks() {
    return this.storageUnitBatches && this.storageUnitBatches.some(sub => sub.unitType === UnitType.SC.code);
  }

  get isKilos() {
    return !this.isSacks;
  }

  public adjustColor() {
      this.color.type = PositionType.ALA.code;
      this.color.quantity = 1;
    }

  public clearColor(){
      this.color.base = null;
    }

  public setColor(color: string){
      this.color.base = color;
  }
}

