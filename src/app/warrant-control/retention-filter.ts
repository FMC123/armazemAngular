import { URLSearchParams } from '@angular/http';

export class RetentionFilter {

  static fromListData(
    listData: Array<RetentionFilter>
  ): Array<RetentionFilter> {
    return listData.map(data => {
      return RetentionFilter.fromData(data);
    });
  }

  static fromData(data: RetentionFilter): RetentionFilter {
    if (!data) return new this();

    let filter = new this(
      data.clientId,
    );

    return filter;
  }

  constructor(
    public clientId?: string,
  ) {}

  public toURLSearchParams(): URLSearchParams {
    let params: URLSearchParams = new URLSearchParams();

    if (this.clientId) {
      params.set('clientId', this.clientId);
    }

    return params;
  }
}
