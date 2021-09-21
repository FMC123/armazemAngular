import { User } from '../../../user/user';
import { MapPosition } from '../../map-position/map-position';
import { MapPositionStorageUnit } from '../../map-position/map-position-storage-unit';
import { DateTimeHelper } from '../../../shared/globalization';

export class MapHistoryLog {

  static fromListData(listData: Array<MapHistoryLog>): Array<MapHistoryLog> {
    return listData.map((data) => {
      return MapHistoryLog.fromData(data);
    });
  }

  static fromData(data: MapHistoryLog): MapHistoryLog {
    if (!data) return new this();
    let object = new this(
      data.logDate,
      data.mapPositionFrom,
      data.heightFrom,
      data.mapPositionTo,
      data.heightTo,
      data.storageUnit,
      data.selected,
      data.createdBy
    );
    return object;
  }

  constructor(public logDate?: number,
              public mapPositionFrom?: MapPosition,
              public heightFrom?: number,
              public mapPositionTo?: MapPosition,
              public heightTo?: number,
              public storageUnit?: MapPositionStorageUnit,
              public selected?: boolean,
              public createdBy?: User
              ) {
    if (mapPositionFrom) {
      this.mapPositionFrom = MapPosition.fromData(mapPositionFrom);
    }
    if (mapPositionTo) {
      this.mapPositionTo = MapPosition.fromData(mapPositionTo);
    }
    if (storageUnit) {
      this.storageUnit = MapPositionStorageUnit.fromData(storageUnit);
    }
    if (createdBy) {
      this.createdBy = User.fromData(createdBy);
    }
  }

  get logDateString(){
    return DateTimeHelper.toHHmm(this.logDate);
  }

  get fullPositionFrom(){
    return this.fullPosition(this.mapPositionFrom, this.heightFrom);
  }

  get fullPositionTo(){
    return this.fullPosition(this.mapPositionTo, this.heightTo);
  }

  private fullPosition(position: MapPosition,
                        height: number) {
    if (!position) {
      return null;
    }
    return `${position.positionNameCode} ${position.stackCode}/${height}`;
  }

}
