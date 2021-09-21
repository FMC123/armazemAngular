export class Sku {
  static fromListData(listData: Array<Sku>): Array<Sku> {
    return listData.map(data => {
      return Sku.fromData(data);
    });
  }

  static fromData(data: Sku): Sku {
    if (!data) return new this();
    if (typeof data.sackSize !== 'undefined' && data.sackSize !== null) {
      data.sackSize = data.sackSize.toString().replace('.', ',');
    }
    if (typeof data.skuQuantity !== 'undefined' && data.skuQuantity !== null) {
      data.skuQuantity = data.skuQuantity.toString().replace('.', ',');
    }
    const parameter = new this(
      data.id,
      data.company_id,
      data.created_by,
      data.created_date,
      data.last_modified_by,
      data.last_modified_date,
      data.deleted_by,
      data.deleted_date,
      data.product,
      data.description,
      data.code,
      data.measurementUnit,
      data.measurementAcronym,
      Sku.fromData(data.skuGroup),
      data.skuQuantity,
      data.sackSize,
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
    public product?: any,
    public description?: any,
    public code?: any,
    public measurementUnit?: any,
    public measurementAcronym?: any,
    public skuGroup?: Sku,
    public skuQuantity?: any,
    public sackSize?: string,
  ) {
  }

  get label() {
    if(this.code === undefined || this.product === undefined) {
      return null;
    }
    return this.code + ' - ' + this.product;
  }
}
