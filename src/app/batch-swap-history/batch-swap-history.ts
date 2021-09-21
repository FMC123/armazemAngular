import {Batch} from '../batch/batch';
import {Tag} from "../tag/tag";
import {DateTimeHelper} from "../shared/globalization";
import {BatchSwapType} from "./batch-swap-types";

export class BatchSwapHistory {
  static fromListData(listData: Array<BatchSwapHistory>): Array<BatchSwapHistory> {
    return listData.map(data => {
      return BatchSwapHistory.fromData(data);
    });
  }

  static fromData(data: any): BatchSwapHistory {
    if (!data) return new this();
    let batchSwapHistory = new this(
      data.id,
      data.originBatch,
      data.destinationBatch,
      data.description,
      data.tagCode,
      data.tag,
      data.quantity,
      data.userName,
      BatchSwapType.fromData(data.swapType),
      data.createdDate,
    );
    return batchSwapHistory;
  }

  constructor(
    public id?: string,
    public originBatch?: any,
    public destinationBatch?: any,
    public description?: string,
    public tagCode?: string,
    public tag?: Tag,
    public quantity?: number,
    public userName?: string,
    public swapType?: BatchSwapType,
    public createdDate?: number,
  ) {

    if (originBatch) {
      this.originBatch = Batch.fromData(originBatch);
    }

    if (destinationBatch) {
      this.destinationBatch = Batch.fromData(destinationBatch);
    }

    if (tag) {
      this.tag = Tag.fromData(tag);
    }
  }

  get createdDateString() {
    return DateTimeHelper.toDDMMYYYY(this.createdDate);
  }
}
