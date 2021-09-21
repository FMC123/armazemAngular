import { DateTimeHelper } from '../shared/globalization';
import { NumberHelper } from '../shared/globalization';
import { User } from '../user/user';
import { Batch } from './batch';
import {Scale} from "../scale/scale";

export class BatchWeight {

  static fromListData(listData: Array<BatchWeight>): Array<BatchWeight> {
    return listData.map((data) => {
      return BatchWeight.fromData(data);
    });
  }

  static fromData(data: BatchWeight): BatchWeight {
    if (!data) return new this();
    let batch = new this(
      data.batch,
      data.weight,
      data.type,
      data.scale,
    );
    return batch;
  }

  constructor(
    public batch?: Batch,
    public weight?: number,
    public type?: string,
    public scale?: Scale,
  ) {

  }

  get weightString(): string {
    return NumberHelper.toPTBR(this.weight);
  }

  set weightString(value) {
    this.weight = NumberHelper.fromPTBR(value);
  }

}
