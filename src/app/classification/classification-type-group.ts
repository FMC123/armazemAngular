export class ClassificationTypeGroup {

  static fromListData(listData: Array<ClassificationTypeGroup>): Array<ClassificationTypeGroup> {
    return listData.map(data => {
      return ClassificationTypeGroup.fromData(data);
    });
  }

  static fromData(data: ClassificationTypeGroup): ClassificationTypeGroup {
    if (!data) return new this();
    let classificationTypeGroup = new this(
      data.id,
      data.name,
      data.groupMin,
      data.groupMax
    );
    return classificationTypeGroup;
  }


  constructor(
    public id?: string,
    public name?: string,
	public groupMin?: number,
	public groupMax?: number
  ) {}
}
