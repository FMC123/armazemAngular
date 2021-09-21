import {MapZonePosition} from "./map-zone-position";
export class MapZonePositionLayer {

  static fromListData(listData: Array<MapZonePositionLayer>): Array<MapZonePositionLayer> {
    return listData.map((data) => {
      return MapZonePositionLayer.fromData(data);
    });
  }

  static fromData(data: MapZonePositionLayer): MapZonePositionLayer {
    if (!data) return new this();
    let layer = new this(
      data.id,
      data.name,
      data.code,
      data.active,
      data.shiftX,
      data.shiftY,
      data.mapPositions
    );
    return layer;
  }

  constructor(public id?: string,
              public name?: string,
              public code?: number,
              public active?: boolean,
              public shiftX?: number,
              public shiftY?: number,
              public mapPositions?: Array<MapZonePosition>
              ) {
    if (mapPositions) {
      this.mapPositions = MapZonePosition.fromListData(mapPositions);
      this.adjustPositionsAxis();
    }
  }

  adjustPositionsAxis() {
    this.mapPositions.forEach((mapPosition: MapZonePosition) => {
      mapPosition.xCoordinate = (mapPosition.xCoordinate || 0) + (this.shiftX || 0);
      mapPosition.yCoordinate = (mapPosition.yCoordinate || 0) + (this.shiftY || 0);
    });
  }
}

