import { Batch } from '../batch';
import { Position } from '../../position/position';

export class BatchPosition {

  static fromListData(listData: Array<BatchPosition>): Array<BatchPosition> {
    return listData.map((data) => {
      return BatchPosition.fromData(data);
    });
  }

  static fromData(data: BatchPosition): BatchPosition {
    if (!data) return new this();
    let batchPosition = new this(
      data.id,
      data.batch,
      data.position,
      data.stackId
    );
    return batchPosition;
  }

  constructor(
    public id?: string,
    public batch?: Batch,
    public position?: Position,
    public stackId?: string
  ) {
    if (batch) {
      this.batch = Batch.fromData(batch);
    }

    if (position) {
      this.position = Position.fromData(position);
    }
  }
}
