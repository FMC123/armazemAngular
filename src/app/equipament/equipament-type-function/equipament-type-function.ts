export class EquipamentTypeFunction {

  static fromListData(listData: Array<EquipamentTypeFunction>): Array<EquipamentTypeFunction> {
    return listData.map((data) => {
      return EquipamentTypeFunction.fromData(data);
    });
  }

  static fromData(data: EquipamentTypeFunction): EquipamentTypeFunction {
    if (!data) {
      return new this();
    }

    let equipamentTypeFunction = new this(
      data.id,
      data.code,
      data.description,
    );

    return equipamentTypeFunction;
  }

  constructor(
    public id?: string,
    public code?: string,
    public description?: string,
  ) { }

}
