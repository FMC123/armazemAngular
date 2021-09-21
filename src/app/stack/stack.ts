import {NumberHelper} from "../shared/globalization/number-helper";
import {Position} from "../position/position";

export class Stack {

  static fromListData(listData: Array<Stack>): Array<Stack> {
    return listData.map((data) => {
      return Stack.fromData(data);
    });
  }

  static fromData(data: Stack): Stack {
    if (!data) return new this();
    let stack = new this(
      data.id,
      data.code,
      data.stackHeight,
      data.position,
      data.yCoord,
      data.xCoord,
      data.height,
      data.width,
      data.distance,
      data.rotation

    );
    return stack;
  }

  constructor(public   id?: string,
              public   code?: string,
              public     stackHeight?: number,
              public   position?: Position,
              public   yCoord?: number,
              public   xCoord?: number,
              public   height?: number,
              public   width?: number,
              public   distance?: number,
              public   rotation?: number) {

    if (position) {
      this.position = Position.fromData(position);
    }
  }
  get yCoordString(): string{
    return NumberHelper.toPTBR(this.yCoord);
  }
  set yCoordString(yCoordString: string){
    this.yCoord = NumberHelper.fromPTBR(yCoordString);
  }

  get xCoordString(): string{
    return NumberHelper.toPTBR(this.xCoord);
  }
  set xCoordString(xCoordString: string){
    this.xCoord = NumberHelper.fromPTBR(xCoordString);
  }

  get heightString(): string{
    return NumberHelper.toPTBR(this.height);
  }
  set heightString(heightString: string){
    this.height = NumberHelper.fromPTBR(heightString);
  }
  get widthString(): string{
    return NumberHelper.toPTBR(this.width);
  }
  set widthString(widthString: string){
    this.width = NumberHelper.fromPTBR(widthString);
  }
  get distanceString(): string{
    return NumberHelper.toPTBR(this.distance);
  }
  set distanceString(distanceString: string){
    this.distance = NumberHelper.fromPTBR(distanceString);
  }
  get rotationString(): string{
    return NumberHelper.toPTBR(this.rotation);
  }
  set rotationString(rotationString: string){
    this.rotation = NumberHelper.fromPTBR(rotationString);
  }
}
