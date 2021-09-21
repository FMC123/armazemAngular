import { BatchOperation } from "app/batch-operation/batch-operation";
import { ProportionalEvictionBatch } from "./proportional-eviction-batch";

export class ProportionalEvictionBatchOperation {

  static fromListData(
    listData: Array<ProportionalEvictionBatchOperation>
  ): Array<ProportionalEvictionBatchOperation> {
    return listData.map(data => {
      return ProportionalEvictionBatchOperation.fromData(data);
    });
  }

  static fromData(data?: ProportionalEvictionBatchOperation): ProportionalEvictionBatchOperation {
    if (!data) {
      return new this();
    }

    let ProportionalEvictionBatchOperation = new this(
      data.batchOperation,
      data.proportionalDumpingSteps,
      ProportionalEvictionBatch.fromListData(data.proportionalEvictionBatch),
      data.totalQuantity,
      data.totalQuantityBags,
      data.totalQuantityPerRound,
    );
    return ProportionalEvictionBatchOperation;
  }

  constructor(
    public batchOperation?: BatchOperation,
    public proportionalDumpingSteps?: number,
    public proportionalEvictionBatch?: ProportionalEvictionBatch[],
    public totalQuantity?: number,
    public totalQuantityBags?: number,
    public totalQuantityPerRound?: number[],
  ) {}

}
