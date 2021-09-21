import {PositionType} from "../../../position/position-type";
export class MapZonePositionColor {

  constructor(public type?: string,
              public storageUnitsQuantityF2?: number,
              public toExit?: boolean,
              public marked?: boolean,
              public blocked?: boolean,) {}

  get fillDarkest(){
    let hsl = this.hslFillDarkest;
    return `hsl(${hsl.h}, ${this.percent(hsl.s)}%, ${this.percent(hsl.l)}%)`;
  }

  get stroke(){
    let hsl = this.hslStroke;
    return `hsl(${hsl.h}, ${this.percent(hsl.s)}%, ${this.percent(hsl.l)}%)`;
  }

  get fill() {
    let hsl = this.hslFill;
    return `hsl(${hsl.h}, ${this.percent(hsl.s)}%, ${this.percent(hsl.l)}%)`;
  }

  get textFill(){
    if (this.hsbFill.b > 0.7) {
      return 'black';
    }
    return 'white';
  }

  private get hsbFill(){
    if (this.type === PositionType.ALA.code){
      if (!this.storageUnitsQuantityF2) {
        return this.hsbEmpty;
      }
      return this.hsbStorageUnit;
    }
    return this.hsbNonStorageUnit;
  }

  private get hsbStorageUnit(){
    let b = 1 - (0.1 * this.storageUnitsQuantityF2);
    if (b < 0.4) {
      b = 0.4;
    }

    let h = 120;
    if (this.toExit) {
      h = 46;
    }
    if (this.marked) {
      h = 230;
    }
    if (this.blocked) {
          h = 320;
    }
    return {
      h,
      s: 0.5,
      b
    };
  }

  private get hsbEmpty(){
    return {
        h: 0,
        s: 0,
        b: 0.62
      };
  }

  private get hsbNonStorageUnit(){
      return {
        h: 0,
        s: 0,
        b: 0.9
      };
  }

  private get hsbStroke(){
    let hsb = Object.assign({}, this.hsbFill);
    hsb.b = hsb.b - 0.2;
    return hsb;
  }

  private get hslFill(){
    let hsb = this.hsbFill;
    return this.hsv2hsl(hsb.h, hsb.s, hsb.b);
  }

  private get hslFillDarkest(){
    let hsb = this.hsbFill;
    return this.hsv2hsl(hsb.h, hsb.s, 0.3);
  }

  private get hslStroke(){
    let hsb = this.hsbStroke;
    return this.hsv2hsl(hsb.h, hsb.s, hsb.b);
  }

  private hsv2hsl(hue, sat, val) {
    return{
        h: hue,
        s: sat * val / ((hue = (2 - sat) * val) < 1 ? hue : 2 - hue),
        l: hue / 2
    };
  }

  private percent(arg) {
    if (!arg) {
      return 0;
    }
    return arg * 100;
  }
}
