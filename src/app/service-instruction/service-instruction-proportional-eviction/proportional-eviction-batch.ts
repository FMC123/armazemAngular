import { MarkupGroupBatch } from "app/markup-group/batch/markup-group-batch";
import { ProportionalEviction } from "./proportional-eviction";

export class ProportionalEvictionBatch {

  static fromListData(
    listData: Array<ProportionalEvictionBatch>
  ): Array<ProportionalEvictionBatch> {
    return listData.map(data => {
      return ProportionalEvictionBatch.fromData(data);
    });
  }

  static fromData(data?: ProportionalEvictionBatch): ProportionalEvictionBatch {
    if (!data) {
      return new this();
    }

    let ProportionalEviction = new this(
      MarkupGroupBatch.fromData(data.markupGroupBatch),
      data.quantityBags,
      data.proportionalEviction,
    );
    return ProportionalEviction;
  }

  constructor(
    public markupGroupBatch?: MarkupGroupBatch,
    public quantityBags?: number,
    public proportionalEviction?: ProportionalEviction[],
  ) {}

}
