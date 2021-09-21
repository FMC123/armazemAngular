
export class ChecklistType {

  static fromListData(listData: Array<ChecklistType>): Array<ChecklistType> {
    return listData.map((data) => {
      return ChecklistType.fromData(data);
    });
  }

  static fromData(data: ChecklistType): ChecklistType {
    if (!data) return new this();
    return new this(
      data.id,
      data.description,
      data.typeChecklist
    );
  }

  constructor(
    public id?: string,
    public description?: string,
    public typeChecklist?: string
  ) { }
}
