import { MapPosition } from './map-position';

export class MapPositionLayer {

  static fromListData(listData: Array<MapPositionLayer>): Array<MapPositionLayer> {
    return listData.map((data) => {
      return MapPositionLayer.fromData(data);
    });
  }

  static fromData(data: MapPositionLayer): MapPositionLayer {
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
              public mapPositions?: Array<MapPosition>
              ) {
    if (mapPositions) {
      this.mapPositions = MapPosition.fromListData(mapPositions);
      this.adjustPositionsAxis();
    }
  }

  adjustPositionsAxis() {
    this.mapPositions.forEach((mapPosition: MapPosition) => {
      mapPosition.xCoordinate = (mapPosition.xCoordinate || 0) + (this.shiftX || 0);
      mapPosition.yCoordinate = (mapPosition.yCoordinate || 0) + (this.shiftY || 0);
    });
  }
}

