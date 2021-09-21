import { URLSearchParams } from '@angular/http';

export class SampleTrackingListFilter {
  static fromListData(
    listData: Array<SampleTrackingListFilter>
  ): Array<SampleTrackingListFilter> {
    return listData.map(data => {
      return SampleTrackingListFilter.fromData(data);
    });
  }

  static fromData(data: SampleTrackingListFilter): SampleTrackingListFilter {
    if (!data) return new this();
    let filter = new this(
      data.codeOrLabel,
      data.departmentId,
      data.createUserId,
      data.batchCodeTerm
    );
    return filter;
  }


  constructor(
    public codeOrLabel?: string,
    //todo: adicionar situação caso existir
    public departmentId?: string,
    public createUserId?: string,
    public batchCodeTerm?: string
  ) {}

  public toURLSearchParams(): URLSearchParams {
    let params: URLSearchParams = new URLSearchParams();

    if (this.codeOrLabel) {
      params.set('codeOrLabel', this.codeOrLabel);
    }

    if (this.departmentId) {
      params.set('departmentId', this.departmentId);
    }

    if (this.createUserId) {
      params.set('createUserId', this.createUserId);
    }

    if (this.batchCodeTerm) {
      params.set('batchCodeTerm', this.batchCodeTerm);
    }

    return params;
  }
}
