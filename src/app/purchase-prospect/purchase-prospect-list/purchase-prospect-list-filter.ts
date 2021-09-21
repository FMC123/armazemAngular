import { URLSearchParams } from '@angular/http';
import { DateTimeHelper } from '../../shared/globalization';
import { Collaborator } from '../../collaborator/collaborator';

export class PurchaseProspectListFilter {

  static fromListData(
    listData: Array<PurchaseProspectListFilter>
  ): Array<PurchaseProspectListFilter> {
    return listData.map(data => {
      return PurchaseProspectListFilter.fromData(data);
    });
  }

  static fromData(
    data: PurchaseProspectListFilter
  ): PurchaseProspectListFilter {
    if (!data) return new this();
    let filter = new this(
      data.prospect,
      data.batchCode,
      data.collaborator,
      data.startDate,
      data.endDate,
      data.status,
    );
    return filter;
  }

  constructor(
    public prospect?: string,
    public batchCode?: string,
    public collaborator?: Collaborator,
    public startDate?: number,
    public endDate?: number,
    public status?: string
  ) { }

  public toURLSearchParams(): URLSearchParams {
    let params: URLSearchParams = new URLSearchParams();

    if (this.prospect) {
      params.set('code', this.prospect);
    }

    if (this.batchCode) {
      params.set('batchCode', this.batchCode);
    }

    if (this.collaborator) {
      params.set('collaborator', this.collaborator.id);
    }

    if (this.startDate) {
      params.append('startDate', this.startDate ? this.startDate.toString() : "");
    }

    if (this.endDate) {
      params.append('endDate', this.endDate ? this.endDate.toString() : "");
    }

    if (this.status) {
      params.set('status', this.status);
    }

    return params;
  }

  get startDateString(): string {
    return DateTimeHelper.toDDMMYYYY(this.startDate);
  }

  set startDateString(startDateString: string) {
    this.startDate = DateTimeHelper.fromDDMMYYYY(startDateString);
  }

  get endDateString(): string {
    return DateTimeHelper.toDDMMYYYY(this.endDate);
  }

  set endDateString(endDateString: string) {
    this.endDate = DateTimeHelper.fromDDMMYYYY(endDateString);
  }
}
