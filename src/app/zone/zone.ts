import { Position } from '../position/position';

export class Zone {

  public positions?: Array<Position>;

  static fromListData(listData: Array<Zone>): Array<Zone> {
    return listData.map((data) => {
      return Zone.fromData(data);
    });
  }

  static fromData(data: Zone): Zone {
    if (!data) return new this();
    let zone = new this(
      data.id,
      data.name,
      data.index,
      data.positions,
    );
    return zone;
  }

  constructor(
    public id?: number,
    public name?: string,
    public index?: number,
    positions?: Array<Position>,
  ) {

    if (positions) {
      this.positions = Position.fromListData(<any>positions);
    }
  }

}
