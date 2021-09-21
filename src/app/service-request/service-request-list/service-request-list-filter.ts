import { URLSearchParams } from '@angular/http';

export class ServiceRequestListFilter {
  static fromListData(
    listData: Array<ServiceRequestListFilter>
  ): Array<ServiceRequestListFilter> {
    return listData.map(data => {
      return ServiceRequestListFilter.fromData(data);
    });
  }

  static fromData(
    data: ServiceRequestListFilter
  ): ServiceRequestListFilter {
    if (!data) return new this();
    let filter = new this(
      data.codeOrBatch,
      data.type,
      data.status
    );
    return filter;
  }

  constructor(
    public codeOrBatch?: string,
    public type?: string,
    public status?: string
  ) { }

  public toURLSearchParams(): URLSearchParams {
    let params: URLSearchParams = new URLSearchParams();

    if (this.codeOrBatch) {
      params.set('codeOrBatch', this.codeOrBatch);
    }

    if (this.type) {
      params.set('type', this.type);
    }

    if (this.status) {
      params.set('status', this.status);
    }

    return params;
  }
}
