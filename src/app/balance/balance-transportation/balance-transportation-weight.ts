import {NumberHelper} from "../../shared/globalization";
import {BatchOperation} from "../../batch-operation/batch-operation";
import {Transportation} from "../../transportation/transportation";
import {Scale} from "../../scale/scale";

export class BalanceTransportationWeight {

  static fromListData(listData: Array<BalanceTransportationWeight>): Array<BalanceTransportationWeight> {
    return listData.map((data) => {
      return BalanceTransportationWeight.fromData(data);
    });
  }

  static fromData(data: BalanceTransportationWeight): BalanceTransportationWeight {
    if (!data) return new this();
    let balanceTransportation = new this(
      data.transportation,
      data.weight,
      data.type,
      data.manual,
      data.scale
    );
    return balanceTransportation;
  }

  constructor(
    public transportation?: Transportation,
    public weight?: number,
    public type?: string,
    public manual?: boolean,
    public scale?: Scale
  )
  {
    if (transportation) {
      this.transportation = Transportation.fromData(transportation);
    }
  }

  get weightString(): string {
    return NumberHelper.toPTBR(this.weight);
  }

  set weightString(value) {
    this.weight = NumberHelper.fromPTBR(value);
  }

}
