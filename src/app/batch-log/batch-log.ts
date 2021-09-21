import { BatchStatus } from '../batch/batch-status';
import { Scale } from '../scale/scale';
import { PackType } from '../pack-type/pack-type';
import { Strainer } from '../strainer/strainer';
import { Drink } from '../drink/drink';
import { PositionType } from '../position/position-type';
import { StorageUnit } from '../storage-unit/storage-unit';
import { DateTimeHelper } from '../shared/globalization';
import { User } from '../user/user';
import { BatchOperation } from './../batch-operation/batch-operation';
import { NumberHelper } from './../shared/globalization/number-helper';
import { Position } from '../position/position';
import {Batch} from "../batch/batch";

export class BatchLog {

  static fromListData(listData: Array<BatchLog>): Array<BatchLog> {
    return listData.map((data) => {
      return BatchLog.fromData(data);
    });
  }

  static fromData(data: BatchLog): BatchLog {
    if (!data) return new this();
    let batch = new this(
      data.id,
      data.batch,
      data.batchCode,
      data.batchOperation,
      data.status,
      data.strainer,
      data.drink,
      data.impurityContent,
      data.moistureContent,
      data.netQuantity,
      data.unitType,
      data.refClient,
      data.storageUnits,
      data.lastModified,
      data.createdDate,
      data.createdBy,
      data.deletedDate,
      data.netWeight,
      data.grossWeight,
      data.tareWeight,
      data.packType,
      data.tareWeighedDate,
      data.grossWeighedDate,
      data.grossWeightTyped,
      data.tareWeightTyped,
      data.tareWeightUser,
      data.grossWeightUser,
      data.grossWeightScale,
      data.tareWeightScale,
      data.position,
    );
    return batch;
  }

  constructor(
    public id?: string,
    public batch?: Batch,
    public batchCode?: string,
    public batchOperation?: BatchOperation,
    public status?: string,
    public strainer?: Strainer,
    public drink?: Drink,
    public impurityContent?: number,
    public moistureContent?: number,
    public netQuantity?: number,
    public unitType?: string,
    public refClient?: string,
    public storageUnits?: Array<StorageUnit | any>,
    public lastModified?: number,
    public createdDate?: number,
    public createdBy?: User,
    public deletedDate?: number,
    public netWeight?: number,
    public grossWeight?: number,
    public tareWeight?: number,
    public packType?: PackType,
    public tareWeighedDate?: number,
    public grossWeighedDate?: number,
    public grossWeightTyped?: boolean,
    public tareWeightTyped?: boolean,
    public tareWeightUser?: User,
    public grossWeightUser?: User,
    public grossWeightScale?: Scale,
    public tareWeightScale?: Scale,
    public position?: Position,
  ) {

    if(batch){
      this.batch = Batch.fromData(batch);
    }

    if (position) {
      this.position = Position.fromData(position);
    }

    if (batchOperation) {
      this.batchOperation = BatchOperation.fromData(batchOperation);
    }
    if (storageUnits) {
      this.storageUnits = StorageUnit.fromListData(storageUnits);
    }
    if (createdBy) {
      this.createdBy = User.fromData(createdBy);
    }
    if (tareWeightUser) {
      this.tareWeightUser = User.fromData(tareWeightUser);
    }

    if (grossWeightUser) {
      this.grossWeightUser = User.fromData(grossWeightUser);
    }

    if (grossWeightScale) {
      this.grossWeightScale = Scale.fromData(grossWeightScale);
    }

    if (tareWeightScale) {
      this.tareWeightScale = Scale.fromData(tareWeightScale);
    }
  }

  get impurityContentString(): string {
    return NumberHelper.toPTBR(this.impurityContent);
  }

  set impurityContentString(value) {
    this.impurityContent = NumberHelper.fromPTBR(value);
  }

  get moistureContentString(): string {
    return NumberHelper.toPTBR(this.moistureContent);
  }

  set moistureContentString(value) {
    this.moistureContent = NumberHelper.fromPTBR(value);
  }

  get netWeightString(): string {
    return NumberHelper.toPTBR(this.netWeight);
  }

  get netWeightCalcString(): string {
    if (this.grossWeight && this.tareWeight
      && this.grossWeight > 0 && this.tareWeight) {
        return NumberHelper.toPTBR(this.grossWeight - this.tareWeight);
      }
      return NumberHelper.toPTBR(0);
  }

  set netWeightString(value) {
    this.netWeight = NumberHelper.fromPTBR(value);
  }

  get statusObject(): BatchStatus {
    return BatchStatus.fromData(this.status);
  }
  set statusObject(value: BatchStatus){
    if (value) {
      this.status = value.code;
    }else {
      this.status = null;
    }
  }

  get storageUnitsCount(): number {
    if (!this.storageUnits && this.storageUnits.length <= 0) {
      return 0;
    }
    return this.storageUnits.length;
  }

  get storageUnitsQuantity(): number {
    if (!this.storageUnitsCount) {
      return 0;
    }
    return this.storageUnits.map((b) => b.quantity)
                    .reduce((a, b) => {
      return Number(a) + Number(b);
    }, 0);
  }

  get storageUnitsInitialWeightString(): string {
    return NumberHelper.toPTBR(this.storageUnitsQuantity);
  }

  get lastModifiedString(): string{
    return DateTimeHelper.toDDMMYYYYHHmm(this.lastModified);
  }
  set lastModifiedString(lastModified: string){
    this.lastModified = DateTimeHelper.fromDDMMYYYYHHmm(lastModified);
  }

  get createdDateString(): string{
    return DateTimeHelper.toDDMMYYYYHHmm(this.createdDate);
  }
  set createdDateString(createdDateString: string){
    this.createdDate = DateTimeHelper.fromDDMMYYYYHHmm(createdDateString);
  }

  get grossWeightString(): string {
    return NumberHelper.toPTBR(this.grossWeight);
  }

  set grossWeightString(value) {
    this.grossWeight = NumberHelper.fromPTBR(value);
  }

  get tareWeightString(): string {
    return NumberHelper.toPTBR(this.tareWeight);
  }

  set tareWeightString(value) {
    this.tareWeight = NumberHelper.fromPTBR(value);
  }

  get deletedDateString(): string{
    return DateTimeHelper.toDDMMYYYYHHmm(this.deletedDate);
  }
  set deletedDateString(deletedDateString: string){
    this.deletedDate = DateTimeHelper.fromDDMMYYYYHHmm(deletedDateString);
  }

  get grossWeighedDateString(): string{
    return DateTimeHelper.toDDMMYYYYHHmm(this.grossWeighedDate);
  }
  set grossWeighedDateString(grossWeighedDateString: string){
    this.grossWeighedDate = DateTimeHelper.fromDDMMYYYYHHmm(grossWeighedDateString);
  }

  get tareWeighedDateString(): string{
    return DateTimeHelper.toDDMMYYYYHHmm(this.tareWeighedDate);
  }
  set tareWeighedDateString(tareWeighedDateString: string){
    this.tareWeighedDate = DateTimeHelper.fromDDMMYYYYHHmm(tareWeighedDateString);
  }

}
