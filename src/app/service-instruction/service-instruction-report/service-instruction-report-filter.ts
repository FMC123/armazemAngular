import { URLSearchParams } from '@angular/http';
import { DateTimeHelper } from '../../shared/globalization';

export class ServiceInstructionReportFilter {

  public createdDateStart: number;
  public createdDateEnd: number;

  static fromListData(listData: Array<ServiceInstructionReportFilter>): Array<ServiceInstructionReportFilter> {
    return listData.map((data) => {
      return ServiceInstructionReportFilter.fromData(data);
    });
  }

  static fromData(data: ServiceInstructionReportFilter): ServiceInstructionReportFilter {
    if (!data) {
      return new this();
    }

    let ServiceInstructionReportFilter = new this(
      data.createdDateStartString,
      data.createdDateEndString,
      data.stakeholderId
    );

    return ServiceInstructionReportFilter;
  }

  constructor(
    public createdDateStartString?: string,
    public createdDateEndString?: string,
    public stakeholderId?: string
  ) {
    this.createdDateStart = DateTimeHelper.fromDDMMYYYY(createdDateStartString);
    this.createdDateEnd = DateTimeHelper.fromDDMMYYYY(this.createdDateEndString);
  }

  public toURLSearchParams(): URLSearchParams {
    let params: URLSearchParams = new URLSearchParams();

    if (this.createdDateStart) {
      params.set('createdDateStart', this.createdDateStart + '');
    }

    if (this.createdDateEnd) {
      params.set('createdDateEnd', this.createdDateEnd + '');
    }

    if (this.stakeholderId) {
      params.set('stakeholderId', this.stakeholderId);
    }

    return params;
  }
}