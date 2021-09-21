

export class ParameterType {

  static fromListData(listData: Array<ParameterType>): Array<ParameterType>{
    return listData.map((data) => {
      return ParameterType.fromData(data);
    });
  }

  static fromData(data: ParameterType): ParameterType {
    if (!data) return new this();
    let parameter = new this(
      data.code,
      data.description,
      data.choices,
      data.blur,
    );
    return parameter;
  }

  constructor(
    public code?: string,
    public description?: string,
    public choices?: Array<string>,
    public blur?: boolean
  ) {}

}
