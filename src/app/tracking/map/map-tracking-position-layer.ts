import { MapTrackingPosition } from './map-tracking-position';

export class MapTrackingPositionLayer {

  static fromListData(listData: Array<MapTrackingPositionLayer>): Array<MapTrackingPositionLayer> {
    return listData.map((data) => {
      return MapTrackingPositionLayer.fromData(data);
    });
  }

  static fromData(data: MapTrackingPositionLayer): MapTrackingPositionLayer {
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

  constructor(
    public id?: string,
    public name?: string,
    public code?: number,
    public active?: boolean,
    public shiftX?: number,
    public shiftY?: number,
    public mapPositions?: Array<MapTrackingPosition>,
  ) {
    if (mapPositions) {
      this.mapPositions = MapTrackingPosition.fromListData(mapPositions);
      this.adjustPositionsAxis();
    }
  }

  adjustPositionsAxis() {
    this.mapPositions.forEach((mapPosition: MapTrackingPosition) => {
      mapPosition.xCoordinate = (mapPosition.xCoordinate || 0) + (this.shiftX || 0);
      mapPosition.yCoordinate = (mapPosition.yCoordinate || 0) + (this.shiftY || 0);
    });
  }
}

