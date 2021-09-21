import { MapPositionStorageUnit } from '../map-position/map-position-storage-unit';
import { MapPositionLayer } from '../map-position/map-position-layer';
import { MapHistoryLog } from './map-history-log/map-history-log';

export class MapHistory {

  static fromListData(listData: Array<MapHistory>): Array<MapHistory> {
    return listData.map((data) => {
      return MapHistory.fromData(data);
    });
  }

  static fromData(data: MapHistory): MapHistory {
    if (!data) return new this();
    let object = new this(
      data.snapshot,
      data.logs
    );
    return object;
  }

  constructor(public snapshot?: Array<MapPositionStorageUnit>,
              public logs?: Array<MapHistoryLog>
              ) {
    if (snapshot) {
      this.snapshot = MapPositionStorageUnit.fromListData(snapshot);
    }else {
      this.snapshot = [];
    }
    if (logs) {
      this.logs = MapHistoryLog.fromListData(logs);
    }else {
      this.logs = [];
    }
  }

}
