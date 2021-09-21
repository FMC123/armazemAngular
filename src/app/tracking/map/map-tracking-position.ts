import { TrackingStorageUnit } from '../storage-unit/tracking-storage-unit';
import { MapTrackingPositionStates } from './states/map-tracking-position-states';
import { PositionType } from './../../position/position-type';

export class MapTrackingPosition {

  static proportion = 12;

  public storageUnits = new Array<TrackingStorageUnit>();

  static fromListData(listData: Array<MapTrackingPosition>): Array<MapTrackingPosition> {
    return listData.map((data) => {
      return MapTrackingPosition.fromData(data);
    });
  }

  static fromData(data: MapTrackingPosition): MapTrackingPosition {
    if (!data) return new this();
    let mapPosition = new this(
      data.id,
      data.positionId,
      data.stackId,
      data.positionCode,
      data.stackCode,
      data.type,
      data.yCoordinate,
      data.xCoordinate,
      data.height,
      data.width,
      data.layer,
      data.rotation,
      data.positionName,
      data.slots,

      data.selected,
      data.ordered,
      data.searched,
    );
    return mapPosition;
  }

  constructor(
    public id?: string,
    public positionId?: string,
    public stackId?: string,
    public positionCode?: string,
    public stackCode?: string,
    public type?: string,
    public yCoordinate?: number,
    public xCoordinate?: number,
    public height?: number,
    public width?: number,
    public layer?: number,
    public rotation?: number,
    public positionName?: string,
    public slots?: number,

    public selected?: boolean,
    public ordered?: boolean,
    public searched?: boolean,
  ) {}

  get state() {
    if (this.searched) {
      if (this.selected && this.ordered) {
        return MapTrackingPositionStates.selected;
      }

      if (this.ordered) {
        return MapTrackingPositionStates.ordered;
      }

      if (this.selected) {
        return MapTrackingPositionStates.selected;
      }

      return MapTrackingPositionStates.searched;
    }

    if (this.ordered) {
      return MapTrackingPositionStates.ordered;
    }

    if (this.storageUnits.length > 0) {
      return MapTrackingPositionStates.filled;
    }

    return MapTrackingPositionStates.blank;
  }

  get clickable() {
    return this.state.clickable;
  }

  get positionNameCode(){
    return this.positionName ? this.positionName : this.positionCode;
  }

  get fullPosition() {
    return `${this.positionNameCode} ${this.stackCode}`;
  }

  get storageUnitsQuantity(){
    return this.storageUnits.length;
  }

  get typeObject(): PositionType {
    return PositionType.fromData(this.type);
  }

  set typeObject(value: PositionType){
    if (value) {
      this.type = value.code;
    }else {
      this.type = null;
    }
  }

  get text(){
    return this.storageUnitsQuantity || '';
  }

  get x(){
    return this.xCoordinate * MapTrackingPosition.proportion;
  }

  get y(){
    return this.yCoordinate * MapTrackingPosition.proportion;
  }

  get adjustedHeight(){
    let adjustedHeight = this.height * MapTrackingPosition.proportion;
    return adjustedHeight - 1;
  }

  get adjustedWidth(){
    let adjustedWidth = this.width * MapTrackingPosition.proportion;
    return adjustedWidth - 1;
  }

  get radius(){
    if (this.adjustedHeight > this.adjustedWidth) {
      return this.adjustedHeight / 2;
    }
    return this.adjustedWidth / 2;
  }

  get transform(){
    if (this.rotation) {
      return `rotate(${this.rotation}, ${this.xCenter}, ${this.yCenter})`;
    }
    return '';
  }

  get xCenter(){
    return this.x + (this.adjustedWidth / 2);
  }

  get yCenter(){
    return this.y + (this.adjustedHeight / 2);
  }

  get strokeWidth(){
    return this.state.strokeWidth;
  }

  get stroke(){
    return this.state.stroke;
  }

  get fill() {
    return this.state.fill;
  }

  get textFill(){
    return this.state.textFill;
  }

}

