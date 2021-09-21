export class EquipamentType {

  static fromListData(listData: Array<EquipamentType>): Array<EquipamentType> {
    return listData.map((data) => {
      return EquipamentType.fromData(data);
    });
  }

  static fromData(data: EquipamentType): EquipamentType {
    if (!data) {
      return new this();
    }

    let equipamentType = new this(
      data.id,
      data.code,
      data.description,
    );

    return equipamentType;
  }

  constructor(
    public id?: string,
    public code?: string,
    public description?: string,
  ) { }

}
