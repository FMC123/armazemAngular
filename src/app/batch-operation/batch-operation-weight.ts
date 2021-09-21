import { DateTimeHelper } from '../shared/globalization';
import { NumberHelper } from '../shared/globalization';
import { User } from '../user/user';
import { BatchOperation } from './batch-operation';
import {Scale} from "../scale/scale";

export class BatchOperationWeight {

  static fromListData(listData: Array<BatchOperationWeight>): Array<BatchOperationWeight> {
    return listData.map((data) => {
      return BatchOperationWeight.fromData(data);
    });
  }

  static fromData(data: BatchOperationWeight): BatchOperationWeight {
    if (!data) return new this();
    let batchOperation = new this(
      data.listBatchOperations,
      data.weight,
      data.type,
      data.manual,
      data.scale,
    );
    return batchOperation;
  }

  constructor(
    public listBatchOperations?: Array<BatchOperation>,
    public weight?: number,
    public type?: string,
    public manual?: boolean,
    public scale?: Scale,
  ) {
    if (listBatchOperations) {
      this.listBatchOperations = BatchOperation.fromListData(listBatchOperations);
    }
  }

  get weightString(): string {
    return NumberHelper.toPTBR(this.weight);
  }

  set weightString(value) {
    this.weight = NumberHelper.fromPTBR(value);
  }

}
