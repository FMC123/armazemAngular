import { Batch } from './batch';
import { Position } from '../position/position';

export class BatchWithPositions {

  static fromListData(listData: Array<BatchWithPositions>): Array<BatchWithPositions> {
    return listData.map((data) => {
      return BatchWithPositions.fromData(data);
    });
  }

  static fromData(data: BatchWithPositions): BatchWithPositions {
    if (!data) return new this();
    let model = new this(
      data.batch,
      data.positions
    );
    return model;
  }

  constructor(public batch?: Batch,
              public positions?: Array<Position>,
              ) {
    if (batch) {
      this.batch = Batch.fromData(batch);
    }
    if (positions) {
      this.positions = Position.fromListData(positions);
    }
  }

}
