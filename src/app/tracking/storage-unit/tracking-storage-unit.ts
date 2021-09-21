import { TrackingStorageUnitStates } from './states/tracking-storage-unit-states';
import { TrackingStorageUnitState } from './states/tracking-storage-unit-state';
import { NumberHelper } from '../../shared/globalization';
import { PositionType } from './../../position/position-type';

export class TrackingStorageUnit {

  static fromListData(listData: Array<TrackingStorageUnit>): Array<TrackingStorageUnit> {
    return listData.map((data) => {
      return TrackingStorageUnit.fromData(data);
    });
  }

  static fromData(data: TrackingStorageUnit) {
    if (!data) return new this();
    let storageUnit = new this(
      data.id,
      data.positionId,
      data.positionCode,
      data.positionName,
      data.stackId,
      data.stackCode,
      data.height,
      data.tagCode,
      data.batchCode,
      data.clientName,
      data.batchOperationCode,
      data.deletedDate,
      data.initialWeight,

      data.selected,
      data.searched,
      data.ordered,
    );
    return storageUnit;
  }

  constructor(
    public id?: string,
    public positionId?: string,
    public positionCode?: string,
    public positionName?: string,
    public stackId?: string,
    public stackCode?: string,
    public height?: number,
    public tagCode?: string,
    public batchCode?: string,
    public clientName?: string,
    public batchOperationCode?: string,
    public deletedDate?: number,
    public initialWeight?: number,

    public selected?: boolean,
    public searched?: boolean,
    public ordered?: boolean,
  ) {}

  get state() {
    if (this.searched) {
      if (this.selected && this.ordered) {
        return TrackingStorageUnitStates.selectedOrdered;
      }

      if (this.ordered) {
        return TrackingStorageUnitStates.searchedOrdered;
      }

      if (this.selected) {
        return TrackingStorageUnitStates.selectedSearched;
      }

      return TrackingStorageUnitStates.searched;
    }

    if (this.ordered) {
      return TrackingStorageUnitStates.ordered;
    }

    return TrackingStorageUnitStates.blank;
  }

  get initialWeightString() {
    return NumberHelper.toPTBR(this.initialWeight);
  }

  get fullPosition(){
    return `${this.positionName ? this.positionName : this.positionCode} ${this.stackCode}/${this.height}`;
  }

}

