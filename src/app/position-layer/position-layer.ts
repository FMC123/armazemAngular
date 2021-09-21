

import {Warehouse} from "../warehouse/warehouse";
import {NumberHelper} from "../shared/globalization/number-helper";
export class PositionLayer {

  static fromListData(listData: Array<PositionLayer>): Array<PositionLayer>{
    return listData.map((data) => {
      return PositionLayer.fromData(data);
    });
  }

  static fromData(data: PositionLayer): PositionLayer {
    if (!data) return new this();
    let positionLayer = new this(
      data.id,
      data.name,
      data.code,
      data.active,
      data.shiftX,
      data.shiftY,
      data.warehouse
    );
    return positionLayer;
  }

  constructor(public id?: string,
              public name?: string,
              public code?: number,
              public active?: boolean,
              public shiftX?: number,
              public shiftY?: number,
              public warehouse?: Warehouse,
             ) {}

  get shiftXString(): string{
    return NumberHelper.toPTBR(this.shiftX);
  }
  set shiftXString(shiftXString: string){
    this.shiftX = NumberHelper.fromPTBR(shiftXString);
  }

  get shiftYString(): string{
    return NumberHelper.toPTBR(this.shiftY);
  }
  set shiftYString(shiftYString: string){
    this.shiftY = NumberHelper.fromPTBR(shiftYString);
  }
}
