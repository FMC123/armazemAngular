import { URLSearchParams } from '@angular/http';
import { DateTimeHelper } from '../../shared/globalization';

export class AuditInventoryReportFilter {

  public referenceDate: number;

  static fromData(data: AuditInventoryReportFilter): AuditInventoryReportFilter {
    if (!data) {
      return new this();
    }

    let AuditInventoryReportFilter = new this(
      data.referenceDateString,
      data.stakeholderId
    );

    return AuditInventoryReportFilter;
  }

  constructor(
    public referenceDateString?: string,
    public stakeholderId?: string
  ) {
    this.referenceDate = DateTimeHelper.fromDDMMYYYY(referenceDateString);
  }

  public toURLSearchParams(): URLSearchParams {
    let params: URLSearchParams = new URLSearchParams();

    if (this.referenceDate) {
      params.set('referenceDate', this.referenceDateString + '');
    }

    if (this.stakeholderId) {
      params.set('ownerId', this.stakeholderId);
    }

    return params;
  }
}
