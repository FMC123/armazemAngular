import {URLSearchParams} from '@angular/http';

export class ContaminantFilter {

  static fromListData(listData: Array<ContaminantFilter>): Array<ContaminantFilter> {
    return listData.map((data) => {
      return ContaminantFilter.fromData(data);
    });
  }

  static fromData(data: ContaminantFilter): ContaminantFilter {
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
      data.allergenic
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
    public allergenic?: any
  ) {
  }

  public toURLSearchParams(): URLSearchParams {
    let params: URLSearchParams = new URLSearchParams();
    return params;
  }

}
