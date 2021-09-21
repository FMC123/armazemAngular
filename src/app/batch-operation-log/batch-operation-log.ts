import { Scale } from '../scale/scale';
import { OperationType } from '../operation-type/operation-type';
import { BatchOperationType } from '../batch-operation/batch-operation-type';
import { BatchOperationStatus } from '../batch-operation/batch-operation-status';
import { WarehouseStakeholder } from '../warehouse-stakeholder/warehouse-stakeholder';
import { FiscalNote } from '../fiscal-note/fiscal-note';
import { DateTimeHelper } from '../shared/globalization';
import { NumberHelper } from '../shared/globalization';
import { User } from '../user/user';

export class BatchOperationLog {

  static fromListData(listData: Array<BatchOperationLog>): Array<BatchOperationLog> {
    return listData.map((data) => {
      return BatchOperationLog.fromData(data);
    });
  }

  static fromData(data: BatchOperationLog): BatchOperationLog {
    if (!data) return new this();
    let batchOperation = new this(
      data.id,
      data.operationType,
      data.batchOperationCode,
      data.auditor,
      data.sacksQuantity,
      data.grossWeight,
      data.tareWeight,
      data.netWeight,
      data.createdDate,
      data.deletedDate,
      data.owner,
      data.status,
      data.type,
      data.normal,
      data.improperSacks,
      data.plastic,
      data.improper,
      data.note,
      data.productWeight,
      data.packWeight,
      data.grossWeighedBy,
      data.taraWeighedBy,
      data.grossWeightTyped,
      data.tareWeightTyped,
      data.grossWeightScale,
      data.tareWeightScale,
    );
    return batchOperation;
  }

  constructor(
    public id?: string,
    public operationType?: OperationType,
    public batchOperationCode?: string,
    public auditor?: User,
    public sacksQuantity?: number,
    public grossWeight?: number,
    public tareWeight?: number,
    public netWeight?: number,
    public createdDate?: number,
    public deletedDate?: number,
    public owner?: WarehouseStakeholder,
    public status?: string,
    public type?: string,
    public normal?: number,
    public improperSacks?: number,
    public plastic?: number,
    public improper?: number,
    public note?: string,
    public productWeight?: number,
    public packWeight?: number,
    public grossWeighedBy?: User,
    public taraWeighedBy?: User,
    public grossWeightTyped?: boolean,
    public tareWeightTyped?: boolean,
    public grossWeightScale?: Scale,
    public tareWeightScale?: Scale,
  ) {
    if (auditor) {
      this.auditor = User.fromData(auditor);
    }

    if (operationType) {
      this.operationType = OperationType.fromData(operationType);
    }

    if (grossWeighedBy) {
      this.grossWeighedBy = User.fromData(grossWeighedBy);
    }

    if (taraWeighedBy) {
      this.taraWeighedBy = User.fromData(taraWeighedBy);
    }

    if (grossWeightScale) {
      this.grossWeightScale = Scale.fromData(grossWeightScale);
    }

    if (tareWeightScale) {
      this.tareWeightScale = Scale.fromData(tareWeightScale);
    }

    this.sacksQuantity = sacksQuantity || 0;
  }

  get allowView() {
    return this.status === BatchOperationStatus.CLOSED.code;
  }

  get allowEdit() {
    return this.status === BatchOperationStatus.OPEN.code
      || this.status === BatchOperationStatus.RESERVED.code;
  }

  get allowDelete() {
    return this.status === BatchOperationStatus.OPEN.code
      || this.status === BatchOperationStatus.RESERVED.code;
  }

  get statusObject(): BatchOperationStatus {
    return BatchOperationStatus.fromData(this.status);
  }

  set statusObject(value: BatchOperationStatus){
    if (value) {
      this.status = value.code;
    }else {
      this.status = null;
    }
  }

  get typeObject(): BatchOperationType {
    return BatchOperationType.fromData(this.type);
  }

  set typeObject(value: BatchOperationType){
    if (value) {
      this.type = value.code;
    }else {
      this.type = null;
    }
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

  get netWeightString(): string {
    return NumberHelper.toPTBR(this.netWeight);
  }

  set netWeightString(value) {
    this.netWeight = NumberHelper.fromPTBR(value);
  }

  get packWeightString(): string {
    return NumberHelper.toPTBR(this.packWeight);
  }

  set packWeightString(value) {
    this.packWeight = NumberHelper.fromPTBR(value);
  }

  get productWeightString(): string {
    return NumberHelper.toPTBR(this.productWeight);
  }

  set productWeightString(value) {
    this.productWeight = NumberHelper.fromPTBR(value);
  }

  get createdDateString(): string{
    return DateTimeHelper.toDDMMYYYYHHmm(this.createdDate);
  }

  set createdDateString(createdDateString: string){
    this.createdDate = DateTimeHelper.fromDDMMYYYYHHmm(createdDateString);
  }

  get deletedDateString(): string{
    return DateTimeHelper.toDDMMYYYYHHmm(this.deletedDate);
  }

  set deletedDateString(deletedDateString: string){
    this.deletedDate = DateTimeHelper.fromDDMMYYYYHHmm(deletedDateString);
  }

  get netWeightCalcString(): string {
    if (this.grossWeight && this.tareWeight
      && this.grossWeight > 0 && this.tareWeight) {
        return NumberHelper.toPTBR(this.grossWeight - this.tareWeight);
      }
      return NumberHelper.toPTBR(0);
  }

}
