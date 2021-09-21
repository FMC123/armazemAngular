import { StorageUnitBatch } from './storage-unit-batch';
import { StorageUnit } from './storage-unit';
import { WarehouseStakeholder } from '../warehouse-stakeholder/warehouse-stakeholder';
import { PackType } from '../pack-type/pack-type';
import { DateTimeHelper, NumberHelper } from '../shared/globalization';
import { User } from '../user/user';
import { Batch } from '../batch/batch';
import { Position } from '../position/position';
import { Stack } from '../stack/stack';
import { Tag } from '../tag/tag';

export class StorageUnitLog {

  static fromListData(listData: Array<StorageUnitLog>): Array<StorageUnitLog> {
    return listData.map((data) => {
      return StorageUnitLog.fromData(data);
    });
  }

  static fromData(data: StorageUnitLog): StorageUnitLog {
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
      data.createdBy,
      data.createdDate,
      data.tagCode,
      data.packType,
      data.packTypeQuantity,
      data.packTypeQuantityComplement,
      data.packTypeOwner,
      data.indRepackage,
      data.batches,
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
    public createdBy?: User,
    public createdDate?: number,
    public tagCode?: string,
    public packType?: PackType,
    public packTypeQuantity?: number,
    public packTypeQuantityComplement?: number,
    public packTypeOwner?: WarehouseStakeholder,
    public indRepackage?: boolean,
    public batches?: Array<StorageUnitBatch>,
    public storageUnit?: StorageUnit,
  ) {
    if (position) {
      this.position = Position.fromData(position);
    }

    if (stack) {
      this.stack = Stack.fromData(stack);
    }

    if (lastModifiedBy){
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

    if (storageUnit) {
      this.storageUnit = StorageUnit.fromData(storageUnit);
    }
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

  get location(): string {
    if (!this.position || !this.stack) {
      return null;
    }

    return `${this.position.code} ${this.stack.code}/${this.stackHeight}`;
  }

  get createdDateString(): string{
    return DateTimeHelper.toDDMMYYYYHHmm(this.createdDate);
  }

  set createdDateString(createdDateString: string){
    this.createdDate = DateTimeHelper.fromDDMMYYYYHHmm(createdDateString);
  }

}
