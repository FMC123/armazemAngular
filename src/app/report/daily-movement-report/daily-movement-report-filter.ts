import { URLSearchParams } from '@angular/http';
import { DateTimeHelper } from '../../shared/globalization';

export class DailyMovementReportFilter {

  public dateStart: number;
  public dateEnd: number;

  static fromData(data: DailyMovementReportFilter): DailyMovementReportFilter {
    if (!data) {
      return new this();
    }

    let DailyMovementReportFilter = new this(
      data.dateStartString,
      data.dateEndString,
      data.stakeholderId
    );

    return DailyMovementReportFilter;
  }

  constructor(
    public dateStartString?: string,
    public dateEndString?: string,
    public stakeholderId?: string
  ) {
    this.dateStart = DateTimeHelper.fromDDMMYYYY(dateStartString);
    this.dateEnd = DateTimeHelper.fromDDMMYYYY(this.dateEndString);
  }

  public toURLSearchParams(): URLSearchParams {
    let params: URLSearchParams = new URLSearchParams();

    if (this.dateStart) {
      params.set('dateStart', this.dateStart + '');
    }

    if (this.dateEnd) {
      params.set('dateEnd', this.dateEnd + '');
    }

    if (this.stakeholderId) {
      params.set('stakeholderId', this.stakeholderId);
    }

    return params;
  }
}