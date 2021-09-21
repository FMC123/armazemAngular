export class TransportationTotals {

  static fromListData(listData: Array<TransportationTotals>): Array<TransportationTotals> {
    return listData.map((data) => {
      return TransportationTotals.fromData(data);
    });
  }

  static fromData(data: TransportationTotals): TransportationTotals {
    if (!data) return new this();
    let TransportationTotals = new this(
      data.type,
      data.inCount,
      data.outCount,
      data.inQuantity,
      data.outQuantity
    );
    return TransportationTotals;
  }

  constructor(
    public type?: string,
    public inCount?: number,
    public outCount?: number,
    public inQuantity?: number,
    public outQuantity?: number,
  ) {
    if (!inCount) {
      this.inCount = 0;
    }

    if (!outCount) {
      this.outCount = 0;
    }

    if (!inQuantity) {
      this.inQuantity = 0;
    }

    if (!outQuantity) {
      this.outQuantity = 0;
    }
  }

}
