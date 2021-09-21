export class ProportionalEviction {

  static fromListData(
    listData: Array<ProportionalEviction>
  ): Array<ProportionalEviction> {
    return listData.map(data => {
      return ProportionalEviction.fromData(data);
    });
  }

  static fromData(data?: ProportionalEviction): ProportionalEviction {
    if (!data) {
      return new this();
    }

    let ProportionalEviction = new this(
      data.round,
      data.quantity,
    );
    return ProportionalEviction;
  }

  constructor(
    public round?: number,
    public quantity?: number,
  ) {}

}