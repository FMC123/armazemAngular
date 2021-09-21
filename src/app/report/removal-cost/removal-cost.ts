import {NumberHelper} from "../../shared/globalization";

export class RemovalCost {
  static fromListData(listData: Array<RemovalCost>): Array<RemovalCost> {
    return listData.map((data) => {
      return RemovalCost.fromData(data);
    });
  }

  static fromData(data: RemovalCost): RemovalCost {
    if (!data) return new this();
    let removalCost = new this(
      data.markupGroupLabel,
      data.batchCode,
      data.storageUnitTag,
      data.color,
      data.type,
      data.numOfBags,
      data.numOfMoves,
      data.sacksQuantity,
      data.removalFactor,
    );
    return removalCost;
  }

  constructor(
    public markupGroupLabel?: string,
    public batchCode?: string,
    public storageUnitTag?: string,
    public color?: string,
    public type?: string,
    public numOfBags?: number,
    public numOfMoves?: number,
    public sacksQuantity?: number,
    public removalFactor?: number,//(num_mov/total_bags)
  ) {}

  get removalFactorString() {
    return NumberHelper.toPTBR(this.removalFactor);
  }
}
