export class BalanceWeight {

  static get zero() {
    return new BalanceWeight(0, false);
  }

  static fromListData(listData: Array<BalanceWeight>): Array<BalanceWeight>{
    return listData.map((data) => {
      return BalanceWeight.fromData(data);
    });
  }

  static fromData(data: BalanceWeight): BalanceWeight {
    if (!data) return new this();
    let user = new this(
      data.weight,
      data.stabilized
    );
    return user;
  }

  constructor(
    public weight?: number,
    public stabilized?: boolean
  ) {
  }

}
