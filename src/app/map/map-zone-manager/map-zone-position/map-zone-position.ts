import {MapZonePositionColor} from "./map-zone-position-color";
import {PositionType} from "../../../position/position-type";

export class MapZonePosition {

  static proportion = 12;

  public selected: boolean;
  public defaultColor: MapZonePositionColor = new MapZonePositionColor();

  static fromListData(listData: Array<MapZonePosition>): Array<MapZonePosition> {
    return listData.map((data) => {
      return MapZonePosition.fromData(data);
    });
  }

  static fromData(data: MapZonePosition): MapZonePosition {
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
      data.color,
      data.isStack,
    );
    return mapPosition;
  }

  constructor(public id?: string,
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
              public color?: string,
              public isStack?: boolean,
              ) {}

  get positionNameCode(){
    return this.positionName ? this.positionName : this.positionCode;
  }

  get fullPosition() {
    return `${this.positionNameCode} ${this.stackCode}`;
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
    if (this.type === PositionType.ALA.code) {
      return '';
    }
    return this.typeObject.code.toUpperCase();
  }

  get circle(){
    return this.type && this.typeObject.shape === 'circle';
  }

  get rect(){
    return !this.type || this.typeObject.shape === 'rect';
  }

  get x(){
    return this.xCoordinate * MapZonePosition.proportion;
  }

  get y(){
    return this.yCoordinate * MapZonePosition.proportion;
  }

  get adjustedHeight(){
    let adjustedHeight = this.height * MapZonePosition.proportion;
    return adjustedHeight >= 1 ? adjustedHeight - 1 : adjustedHeight;
  }

  get adjustedWidth(){
    let adjustedWidth = this.width * MapZonePosition.proportion;
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
    if (this.selected) {
      return 2;
    }
    return 1;
  }

  get stroke(){
    if (this.selected) {
      return this.defaultColor.stroke;
    }
    this.adjustColor();
    return this.defaultColor.stroke;
  }

  get fill() {
    if (this.selected) {
      return this.color;
    }
    this.adjustColor();
    return this.defaultColor.fill;
  }

  get textFill(){
    this.adjustColor();
    return this.defaultColor.textFill;
  }

  private adjustColor() {
    this.defaultColor.type = this.type;
  }
}

