import { BatchOperation } from '../batch-operation/batch-operation';
import { PackStockMovement } from './pack-stock-movement';
import { DateTimeHelper } from '../shared/globalization';
import { PackStockMovementGroupRecordType } from './pack-stock-movement-group-record-type';
import { WarehouseStakeholder } from '../warehouse-stakeholder/warehouse-stakeholder';
import { OperationType } from '../operation-type/operation-type';
import { PackType } from '../pack-type/pack-type';
import { NumberHelper } from '../shared/globalization';
import {FiscalNote} from "../fiscal-note/fiscal-note";

export class PackStockMovementGroup {

  movements: Array<PackStockMovement> = [];

  static fromListData(listData: Array<PackStockMovementGroup>): Array<PackStockMovementGroup> {
    return listData.map((data) => {
      return PackStockMovementGroup.fromData(data);
    });
  }

  static fromData(data?: PackStockMovementGroup): PackStockMovementGroup {
    if (!data) {
      return new this();
    }

    let packStockMovementGroup = new this(
      data.id,
      data.indStockOut,
      data.operationTypeOnOut,
      data.registrationDate,
      data.owner,
      data.observation,
      data.document,
      data.recordType,
      data.batchOperation,
      data.fiscalNote
    );

    return packStockMovementGroup;
  }

  constructor(
    public id?: string,
    public indStockOut?: boolean,
    public operationTypeOnOut?: OperationType,
    public registrationDate?: number,
    public owner?: WarehouseStakeholder,
    public observation?: string,
    public document?: string,
    public recordType?: string,
    public batchOperation?: BatchOperation,
    public fiscalNote?: FiscalNote
  ) {
    if (operationTypeOnOut) {
      this.operationTypeOnOut = OperationType.fromData(operationTypeOnOut);
    }

    if (owner) {
      this.owner = WarehouseStakeholder.fromData(owner);
    }
  }

  get recordTypeObject() {
    if (!this.recordType) {
      return null;
    }

    return PackStockMovementGroupRecordType.fromData(this.recordType);
  }

  get registrationDateString() {
    return DateTimeHelper.toDDMMYYYY(this.registrationDate);
  }

  set registrationDateString(value) {
    this.registrationDate = DateTimeHelper.fromDDMMYYYY(value);
  }

  get recordTypeIsManual() {
    return (this.recordType == PackStockMovementGroupRecordType.MANUAL.code);
  }

}
