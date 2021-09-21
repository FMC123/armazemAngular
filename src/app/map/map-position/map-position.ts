import { MarkupGroup } from '../../markup-group/markup-group';
import { PositionType } from './../../position/position-type';
import { MapPositionColor } from './map-position-color';
import { MapPositionStorageUnit } from './map-position-storage-unit';

export class MapPosition {

  static proportion = 12;

  public color: MapPositionColor = new MapPositionColor();
  public bagCount:number = 0;
  public highlighted: boolean = false;

  static fromListData(listData: Array<MapPosition>): Array<MapPosition> {
    return listData.map((data) => {
      return MapPosition.fromData(data);
    });
  }

  static fromData(data: MapPosition): MapPosition {
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
      data.groupId,
      data.hidden,
      data.active,
      data.deletedDate,
      data.isStack,
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
    public groupId?: number,
    public hidden?: boolean,
    public active?: boolean,
    public deletedDate?: number,
    public isStack?: boolean,
  ) { }

  get positionNameCode() {
    return this.positionName ? this.positionName : this.positionCode;
  }

  get fullPosition() {
    return `${this.positionNameCode} ${this.stackCode}`;
  }

  // Sometimes the position could have no children,
  // but need to be selected too
  public selected: boolean;

  /*get selected() {
    return this._selected || this.mapPositionStorageUnits.some((mpb) => mpb.selected);
  }*/

  /*set selected(value) {
    this._selected = value;
    if (value) {
      if (this.mapPositionStorageUnits.length > 0) {
        this.mapPositionStorageUnits[0].selected = value;
      }
      this.mapPositionStorageUnits.forEach((mpb) => {
        // highlighted
        mpb.highlighted = value;
      });
    } else {
      this.mapPositionStorageUnits.forEach((mpb) => {
        // selected
        mpb.selected = value;
      });
    }
  }*/

  // This selection is for the history map
  // when the storageUnit is from this position to another
  public selectedFrom: boolean;
  /*get selectedFrom() {
    return this._selectedFrom || this.mapPositionStorageUnits.some((mpb) => mpb.selectedFrom);
  }
  set selectedFrom(value) {
    this._selectedFrom = value;
    if (value) {
      if (this.mapPositionStorageUnits.length > 0) {
        this.mapPositionStorageUnits[0].selectedFrom = value;
      }
      this.mapPositionStorageUnits.forEach((mpb) => {
        // highlighted
        mpb.highlighted = value;
      });
    } else {
      this.mapPositionStorageUnits.forEach((mpb) => {
        // selectedFrom
        mpb.selectedFrom = value;
      });
    }
  }*/

  /*get highlighted() {
    return this.mapPositionStorageUnits.some((mpb) => mpb.highlighted);
  }

  set highlighted(value) {
    this.mapPositionStorageUnits.forEach((mpb) => mpb.highlighted = value);
  }*/

  /*get storageUnitsQuantityF2() {
    return this.mapPositionStorageUnits.length;
  }*/

  get typeObject(): PositionType {
    return PositionType.fromData(this.type);
  }
  set typeObject(value: PositionType) {
    if (value) {
      this.type = value.code;
    } else {
      this.type = null;
    }
  }

  get text() {
    if (this.type === PositionType.ALA.code) {
      return this.bagCount + '';
    }

    if (this.type === PositionType.SACARIA.code) {
      return this.bagCount ? this.bagCount : '';
    }

    if(this.type === PositionType.DESCRITIVO.code) {
      return this.positionName? this.positionName : '';
    }

    return this.typeObject.code.toUpperCase();
  }

  get circle() {
    return this.type && this.typeObject.shape === 'circle';
  }

  get rect() {
    return !this.type || this.typeObject.shape === 'rect';
  }

  get x() {
    return this.xCoordinate * MapPosition.proportion;
  }

  get y() {
    return this.yCoordinate * MapPosition.proportion;
  }

  get adjustedHeight() {
    let adjustedHeight = this.height * MapPosition.proportion;
    return adjustedHeight >= 1 ? adjustedHeight - 1 : adjustedHeight;
  }

  get adjustedWidth() {
    let adjustedWidth = this.width * MapPosition.proportion;
    return adjustedWidth - 1;
  }

  get radius() {
    if (this.adjustedHeight > this.adjustedWidth) {
      return this.adjustedHeight / 2;
    }
    return this.adjustedWidth / 2;
  }

  get transform() {
    if (this.rotation) {
      return `rotate(${this.rotation}, ${this.xCenter}, ${this.yCenter})`;
    }
    return '';
  }

  get transformToDescriptive() {
    if (this.rotation && this.type === PositionType.DESCRITIVO.code) {
      return `rotate(${this.rotation}, ${this.xCenter}, ${this.yCenter})`;
    }
    return '';
  }

    get discriptiveTextSize(){
      return (this.height && this.height > 1)? this.height * 10 : null;
  }
  get xCenter() {
    return this.x + (this.adjustedWidth / 2);
  }

  get yCenter() {
    return this.y + (this.adjustedHeight / 2);
  }

  get strokeWidth() {
    if (this.selected
      || this.highlighted) {
      return 2;
    }
    return 1;
  }

  get stroke() {
    this.adjustColor();
    return this.color.stroke;
  }

  get fill() {
    this.adjustColor();
    return this.color.fill;
  }

  get textFill() {
    this.adjustColor();
    return this.color.text;
  }

  public adjustColor() {
    this.color.type = this.type;
    this.color.quantity = this.bagCount;
  }

  public clearColor(){
    this.color.base = null;
  }

  public setColor(color: string){
    this.color.base = color;
  }

}
