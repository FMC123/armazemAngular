import { Colors } from '../../color/colors';
import { PositionType } from './../../position/position-type';
export class MapPositionColor {

  constructor(
    public type?: string,
    public quantity?: number,
    public base?: string
  ) {}

  get darkest(){
    let hsl = this.darkestHsl;
    return `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
  }

  get stroke(){
    let hsl = this.strokeHsl;
    return `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
  }

  get fill() {
    let hsl = this.fillHsl;
    return `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
  }

  get text(){
    if (this.fillHsl.l > 40) {
      return 'black';
    }
    return 'white';
  }

  get darkestHsl() {
    const {h, s, l} = this.fillHsl;
    return {h, s, l: 40};
  }

  get strokeHsl() {
    const {h, s, l} = this.fillHsl;
    return {h, s, l: l - 20};
  }

  get fillHsl() {
    if (!this.quantity) {
      return this.emptyHsl;
    }

    return this.storageUnitHsl;
  }

  get emptyHsl() {
    return {
      h: 0,
      s: 0,
      l: 62,
    };
  }

  get storageUnitHsl() {
    if (this.base) {
      let {h, s, l} = Colors.hexToHsl(this.base);
      h = h * 360;
      s = s * 100;
      l = l * 100;

      return {h, s, l};
    }

    let h = 120;
    let s = 50;
    return {
      h,
      s,
      l: Math.max(10, 70 - (this.quantity * 5)),
    };
  }

}
