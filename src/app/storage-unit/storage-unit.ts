import { StorageUnitBatch } from './storage-unit-batch';
import { WarehouseStakeholder } from '../warehouse-stakeholder/warehouse-stakeholder';
import { PackType } from '../pack-type/pack-type';
import { DateTimeHelper, NumberHelper } from '../shared/globalization';
import { User } from '../user/user';
import { Batch } from '../batch/batch';
import { Position } from '../position/position';
import { Stack } from '../stack/stack';
import { Tag } from '../tag/tag';

export class StorageUnit {

  static fromListData(listData: Array<StorageUnit>): Array<StorageUnit> {
    return listData.map((data) => {
      return StorageUnit.fromData(data);
    });
  }

  static fromData(data: StorageUnit): StorageUnit {
    if (!data) {
      return new this();
    }

    let storageUnit = new this(
      data.id,
      data.tag,
      data.position,
      data.stack,
      data.stackHeight,
      data.logDate,
      data.indRfid,
      data.indAutoWeight,
      data.indAutoPosition,
      data.lastModifiedBy,
      data.lastModified,
      data.createdBy,
      data.createdDate,
      data.tagCode,
      data.packType,
      data.packTypeQuantity,
      data.packTypeQuantityComplement,
      data.packTypeOwner,
      data.indRepackage,
      data.batches,
      data.classZimPadraoCafe,
      data.classZimBebida,
      data.classZimQuebraAmostragem,
      data.batch,
      data.selected
    );

    return storageUnit;
  }

  constructor(
    public id?: string,
    public tag?: Tag,
    public position?: Position,
    public stack?: Stack,
    public stackHeight?: number,
    public logDate?: number,
    public indRfid?: boolean,
    public indAutoWeight?: boolean,
    public indAutoPosition?: boolean,
    public lastModifiedBy?: User,
    public lastModified?: number,
    public createdBy?: User,
    public createdDate?: number,
    public tagCode?: string,
    public packType?: PackType,
    public packTypeQuantity?: number,
    public packTypeQuantityComplement?: number,
    public packTypeOwner?: WarehouseStakeholder,
    public indRepackage?: boolean,
    public batches?: Array<StorageUnitBatch>,
    public classZimPadraoCafe?: string,
    public classZimBebida?: string,
    public classZimQuebraAmostragem?: number,
    public batch?: Batch,
    public selected?: boolean,
  ) {
    if (position) {
      this.position = Position.fromData(position);
    }

    if (stack) {
      this.stack = Stack.fromData(stack);
    }

    if (lastModifiedBy) {
      this.lastModifiedBy = User.fromData(lastModifiedBy);
    }

    if (createdBy) {
      this.createdBy = User.fromData(createdBy);
    }

    if (packTypeOwner) {
      this.packTypeOwner = WarehouseStakeholder.fromData(packTypeOwner);
    }

    if (batches) {
      this.batches = StorageUnitBatch.fromListData(batches);
    }
    if (!selected) {
      this.selected = false;
    }
  }

  get tagLabel() {
    var label;

    if (!this.tag || !this.tag.tagCode)
      label =  '<sem tag>';
    else
      label = this.tag.tagCode + '';

    if (this.position && this.position.isSilo)
      label = 'SILO';

    return label;
  }

  get unitType() {
    if (!this.batches || !this.batches.length) {
      return null;
    }

    return this.batches[0].unitType;
  }

  get quantity() {
    if (!this.batches || !this.batches.length) {
      return 0;
    }

    return this.batches.map(b => b.quantity).reduce((a, b) => Number(a) + Number(b), 0);
  }

  get quantityString() {
    return NumberHelper.toPTBR(this.quantity);
  }

  get quantityRef() {
    if (!this.batches || !this.batches.length) {
      return 0;
    }

    return this.batches.map(b => b.quantityRef).reduce((a, b) => Number(a) + Number(b), 0);
  }

  get quantityRefString() {
    return NumberHelper.toPTBR(this.quantityRef);
  }

  get showQuantity() {
    return this.batches && this.batches.length
  }

  get location(): string {

    if (!this.position) {
      return null;
    }

    let name = this.position.name != null ? ' ' + this.position.name : '';

    if(this.stack && this.stack.code && this.stackHeight)
      return `${this.position.code} ${this.stack.code}/${this.stackHeight}${name}`;
    else
      return `${this.position.code} - ${name}`;
  }

  get logDateString(): string {
    return DateTimeHelper.toDDMMYYYYHHmm(this.logDate);
  }

  set logDateString(logDateString: string) {
    this.logDate = DateTimeHelper.fromDDMMYYYYHHmm(logDateString);
  }

  get lastModifiedString(): string {
    return DateTimeHelper.toDDMMYYYYHHmm(this.lastModified);
  }

  set lastModifiedString(lastModifiedString: string) {
    this.lastModified = DateTimeHelper.fromDDMMYYYYHHmm(lastModifiedString);
  }

  get createdDateString(): string {
    return DateTimeHelper.toDDMMYYYYHHmm(this.createdDate);
  }

  set createdDateString(createdDateString: string) {
    this.createdDate = DateTimeHelper.fromDDMMYYYYHHmm(createdDateString);
  }

  get quantityByBatch() {
    if (!this.batches || !this.batches.length) {
      return 0;
    }
    return this.batches.map(b => b.batch.id === this.batch.id ? b.quantity : 0)
      .reduce((a, b) => Number(a) + Number(b), 0);
  }

  get quantityByBatchString() {
    return NumberHelper.toPTBR(this.quantityByBatch);
  }

  get showQuantityByBatch() {
    return this.batches && this.batches.length && this.batches.length > 1
  }

  toggleSelected() {
    this.selected = !this.selected;
  }
}
