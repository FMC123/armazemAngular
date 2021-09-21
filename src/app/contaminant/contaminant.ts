export class Contaminant {
  static fromListData(listData: Array<Contaminant>): Array<Contaminant> {
    return listData.map(data => {
      return Contaminant.fromData(data);
    });
  }

  static fromData(data: Contaminant): Contaminant {
    if (!data) return new this();
    const parameter = new this(
      data.id,
      data.company_id,
      data.created_by,
      data.created_date,
      data.last_modified_by,
      data.last_modified_date,
      data.deleted_by,
      data.deleted_date,
      data.name,
      data.description,
      data.allergenic,
      data.traceable
    );
    return parameter;
  }

  constructor(
    public id?: any,
    public company_id?: any,
    public created_by?: any,
    public created_date?: any,
    public last_modified_by?: any,
    public last_modified_date?: any,
    public deleted_by?: any,
    public deleted_date?: any,
    public name?: any,
    public description?: any,
    public allergenic?: any,
    public traceable?: any
  ) {
  }

  get label() {
    if(this.name === undefined) {
      return null;
    }
    return this.name;
  }
}
