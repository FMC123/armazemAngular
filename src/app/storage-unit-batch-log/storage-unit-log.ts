import { Forklift } from 'app/forklift/forklift';

import { PackType } from '../pack-type/pack-type';
import { Position } from '../position/position';
import { DateTimeHelper } from '../shared/globalization';
import { Stack } from '../stack/stack';
import { StorageUnit } from '../storage-unit/storage-unit';
import { StorageUnitBatch } from '../storage-unit/storage-unit-batch';
import { Tag } from '../tag/tag';
import { User } from '../user/user';
import { WarehouseStakeholder } from '../warehouse-stakeholder/warehouse-stakeholder';
import {StorageUnitMovementType} from "./storage-unit-movement-type";

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

    let storageUnitLog = new this(
      data.id,
      data.tag,
      data.position,
      data.stack,
      data.stackHeight,
      data.logDate,
      data.pickDate,
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
      data.storageUnit,
      data.forklift,
      data.durationLogDatePickDateMS,
      data.movementType
    );

    return storageUnitLog;
  }

  constructor(
    public id?: string,
    public tag?: Tag,
    public position?: Position,
    public stack?: Stack,
    public stackHeight?: number,
    public logDate?: number,
    public pickDate?: number,
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
    public forklift?: Forklift,
    public durationLogDatePickDateMS?: string,
    public movementType?: string
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

    if (storageUnit) {
      this.storageUnit = StorageUnit.fromData(storageUnit);
    }

    if (forklift) {
      this.forklift = Forklift.fromData(forklift);
    }
  }

  get movementTypeObject(): StorageUnitMovementType {
    return StorageUnitMovementType.fromData(this.movementType);
  }

  set movementTypeObject(value: StorageUnitMovementType) {
    if (value) {
      this.movementType = value.code;
    } else {
      this.movementType = null;
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

  get createdDateString(): string {
    return DateTimeHelper.toDDMMYYYYHHmm(this.createdDate);
  }

  set createdDateString(createdDateString: string) {
    this.createdDate = DateTimeHelper.fromDDMMYYYYHHmm(createdDateString);
  }

  get logDateString(): string {
    return DateTimeHelper.toDDMMYYYYHHmm(this.logDate);
  }

  set logDateString(logDate: string) {
    this.logDate = DateTimeHelper.fromDDMMYYYYHHmm(logDate);
  }

  get pickDateString(): string {
    return DateTimeHelper.toDDMMYYYYHHmm(this.pickDate);
  }

  set pickDateString(pickDate: string) {
    this.pickDate = DateTimeHelper.fromDDMMYYYYHHmm(pickDate);
  }
}
