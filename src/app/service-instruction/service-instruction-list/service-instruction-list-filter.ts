import { URLSearchParams } from '@angular/http';
import { ServiceInstructionType } from '../../service-instruction-type/service-instruction-type';
import { ServiceInstructionStatus } from './../service-instruction-status';

export class ServiceInstructionListFilter {
  static fromListData(
    listData: Array<ServiceInstructionListFilter>
  ): Array<ServiceInstructionListFilter> {
    return listData.map(data => {
      return ServiceInstructionListFilter.fromData(data);
    });
  }

  static fromData(
    data: ServiceInstructionListFilter): ServiceInstructionListFilter {
    if (!data) return new this();
    let filter = new this(
      data.codeOrName,
      data.typeId,
      data.status,
      data.batchCode,
      data.includeClosedOrCancelled
    );
    return filter;
  }

  constructor(
    public codeOrName?: string,
    public typeId?: string,
    public status?: string,
    public batchCode?: string,
    public includeClosedOrCancelled?: boolean
  ) { }

  public toURLSearchParams(): URLSearchParams {
    let params: URLSearchParams = new URLSearchParams();

    if (this.codeOrName) {
      params.set('codeOrName', this.codeOrName);
    }

    if (this.typeId) {
      params.set('typeId', this.typeId);
    }

    if (this.status) {
      params.set('status', String(this.status));
    }

    if (this.batchCode) {
      params.set('batchCode', this.batchCode);
    }

    if (this.includeClosedOrCancelled) {
      params.set('includeClosedOrCancelled', String(this.includeClosedOrCancelled));
    }

    return params;
  }
}
