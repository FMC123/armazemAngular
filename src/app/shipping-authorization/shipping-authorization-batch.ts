import { NumberHelper } from '../shared/globalization';
import { Batch } from '../batch/batch';

export class ShippingAuthorizationBatch {

  static fromListData(listData: Array<ShippingAuthorizationBatch>): Array<ShippingAuthorizationBatch> {
    return listData.map((data) => {
      return ShippingAuthorizationBatch.fromData(data);
    });
  }

  static fromData(data: ShippingAuthorizationBatch): ShippingAuthorizationBatch {
    if (!data) {
      return new this();
    }

    let shippingAuthorizationBatch = new this(
      data.id,
      data.batch,
      data.weight,
    );

    return shippingAuthorizationBatch;
  }

  constructor(
    public id?: string,
    public batch?: Batch,
    public weight?: number,
  ) {
    if (batch) {
      this.batch = Batch.fromData(batch);
    }
  }

  get weightString(): string {
    return NumberHelper.toPTBR(this.weight);
  }

  set weightString(value) {
    this.weight = NumberHelper.fromPTBR(value);
  }

}
