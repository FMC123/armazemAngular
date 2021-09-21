import { DateTimeHelper } from '../shared/globalization';
import { NumberHelper } from '../shared/globalization';
import { User } from '../user/user';
import { BatchLog } from './batch-log';

export class BatchWeight {

  static fromListData(listData: Array<BatchWeight>): Array<BatchWeight> {
    return listData.map((data) => {
      return BatchWeight.fromData(data);
    });
  }

  static fromData(data: BatchWeight): BatchWeight {
    if (!data) return new this();
    let batch = new this(
      data.listBatch,
      data.weight,
      data.type,
    );
    return batch;
  }

  constructor(
    public listBatch?: Array<BatchLog>,
    public weight?: number,
    public type?: string,
  ) {
    if (listBatch) {
      this.listBatch = BatchLog.fromListData(listBatch);
    }
  }

  get weightString(): string {
    return NumberHelper.toPTBR(this.weight);
  }

  set weightString(value) {
    this.weight = NumberHelper.fromPTBR(value);
  }

}
