import { Warehouse } from '../../warehouse/warehouse';

export class TrackingSearchFilter {

  static fromListData(listData: Array<TrackingSearchFilter>): Array<TrackingSearchFilter> {
    return listData.map((data) => {
      return TrackingSearchFilter.fromData(data);
    });
  }

  static fromData(data: TrackingSearchFilter): TrackingSearchFilter {
    if (!data) return new this();
    let filter = new this(
      data.id,
      data.batchCode,
      data.certificateId,
      data.classificationBeverage,
      data.classificationBeverageComplement,
      data.classificationPattern,
      data.classificationBean,
      data.classificationColour,
    );
    return filter;
  }

  constructor(
    public id?: String,
    public batchCode?: String,
    public certificateId?: String,
    public classificationBeverage?: string,
    public classificationBeverageComplement?: string,
    public classificationPattern?: string,
    public classificationBean?: string,
    public classificationColour?: string,
  ) {

  }

  get isEmpty(): boolean{
    return !Object.keys(this).some((key) => !!this[key]);
  }

}
