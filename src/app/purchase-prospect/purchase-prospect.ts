import { DateTimeHelper } from '../shared/globalization';
import { NumberHelper } from '../shared/globalization';
import { Collaborator } from '../collaborator/collaborator';
import { BatchOperation } from './../batch-operation/batch-operation';
import { PurchaseProspectStatus } from './purchase-prospect-status';

export class PurchaseProspect {

  static fromListData(listData: Array<PurchaseProspect>): Array<PurchaseProspect> {
    return listData.map((data) => {
      return PurchaseProspect.fromData(data);
    });
  }

  static fromData(data?: PurchaseProspect): PurchaseProspect {
    if (!data) {
      return new this();
    }

    let purchaseProspect = new this(
      data.id,
      data.code,
      data.collaborator,
      data.date,
      data.status,
      data.contractPurchase,
      data.observation,
      data.batchOperation
    );

    return purchaseProspect;
  }

  constructor(
    public id?: string,
    public code?: string,
    public collaborator?: Collaborator,
    public date?: number,
    public status?: string,
    public contractPurchase?: string,
    public observation?: string,
    public batchOperation?: BatchOperation
  ) {
    if (collaborator) {
      this.collaborator = Collaborator.fromData(collaborator);
    }

    this.batchOperation = (batchOperation)
      ? BatchOperation.fromData(batchOperation)
      : new BatchOperation();
  }

  get createdDateString(): string {
    return DateTimeHelper.toDDMMYYYY(this.date);
  }

  set createdDateString(createdDateString: string) {
    this.date = DateTimeHelper.fromDDMMYYYY(createdDateString);
  }

  get statusObject() {
    return PurchaseProspectStatus.fromData(this.status);
  }

}
