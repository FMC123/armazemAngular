export class PositionSacaria {

  static fromListData(listData: Array<PositionSacaria>): Array<PositionSacaria> {
    return listData.map((data) => {
      return PositionSacaria.fromData(data);
    });
  }

  static fromData(data: any): PositionSacaria {
    if (!data) return new this();
    let positionSacaria = new this(
      data.id,
      data.code,
      data.quantityInSacks,
    );
    return positionSacaria;
  }

  constructor(
    public id?: string,
    public code?: string,
    public quantityInSacks?: number,
  ) { }

  get label(){
    return `${this.code} - ${this.quantityInSacks} sacas`;
  }
}
