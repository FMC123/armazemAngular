import { NumberHelper } from '../../shared/globalization';
import { TrackingStorageUnit } from '../storage-unit/tracking-storage-unit';
import { TrackingBatchStates } from './states/tracking-batch-states';
import { TrackingBatchState } from './states/tracking-batch-state';
import { Batch } from '../../batch/batch';

export class TrackingBatch extends Batch {

  public selected? = false;
  public searched? = false;
  public ordered? = false;
  public opened? = false;
  public weight? = 0;
  public storageUnits?: Array<TrackingStorageUnit> = [];

  static fromListData(listData: Array<TrackingBatch>): Array<TrackingBatch> {
    return listData.map((data) => {
      return TrackingBatch.fromData(data);
    });
  }

  static fromData(data: TrackingBatch): TrackingBatch {
    return new TrackingBatch(data);
  }

  constructor(data) {
    super(
      data.id,
      data.batchCode,
      data.batchOperation,
      data.status,
      data.strainer,
      data.drink,
      data.impurityContent,
      data.moistureContent,
      data.quantity,
      data.unitType,
      data.storageUnits,
      data.createdDate,
      data.createdBy,
      data.positionId,
      data.positionCode,
      data.positionName,
      data.positionType,
      data.deletedDate,
    );
  }

  get weightString() {
    return NumberHelper.toPTBR(this.weight);
  }

  get state() {
    if (this.searched) {
      if (this.selected && this.ordered) {
        return TrackingBatchStates.selectedOrdered;
      }

      if (this.ordered) {
        return TrackingBatchStates.searchedOrdered;
      }

      if (this.selected) {
        return TrackingBatchStates.selectedSearched;
      }

      return TrackingBatchStates.searched;
    }

    if (this.ordered) {
      return TrackingBatchStates.ordered;
    }

    return TrackingBatchStates.blank;
  }

  get classifications() {
    return null;
  }

}
