import { URLSearchParams } from '@angular/http';
import { DateTimeHelper } from '../shared/globalization';
import { WarehouseStakeholder } from 'app/warehouse-stakeholder/warehouse-stakeholder';

export class ChargingGenerationFilter {

  static fromListData(listData: Array<ChargingGenerationFilter>): Array<ChargingGenerationFilter> {
    return listData.map((data) => {
      return ChargingGenerationFilter.fromData(data);
    });
  }

  static fromData(data: ChargingGenerationFilter): ChargingGenerationFilter {
    if (!data) {
      return new this();
    }

    let ChargingGenerationFilter = new this(
      data.createdDateStart,
      data.createdDateEnd,
      data.stakeholders,
      data.charged,
      data.reprocess,
    );

    return ChargingGenerationFilter;
  }

  constructor(
    public createdDateStart?: number,
    public createdDateEnd?: number,
    public stakeholders?: WarehouseStakeholder[],
    public charged?: boolean,
    public reprocess?: boolean,
  ) {

    this.stakeholders = (stakeholders) ?
      WarehouseStakeholder.fromListData(stakeholders)
      : [];
  }

  get createdDateStartString(): string {
    return DateTimeHelper.toDDMMYYYY(this.createdDateStart);
  }

  set createdDateStartString(createdDateStartString: string) {
    this.createdDateStart = DateTimeHelper.fromDDMMYYYY(createdDateStartString);
  }

  get createdDateEndString(): string {
    return DateTimeHelper.toDDMMYYYY(this.createdDateEnd);
  }

  set createdDateEndString(createdDateEndString: string) {
    this.createdDateEnd = DateTimeHelper.fromDDMMYYYY(createdDateEndString);
  }

  public toURLSearchParams(): URLSearchParams {
    let params: URLSearchParams = new URLSearchParams();

    if (this.createdDateStart) {
      params.set('createdDateStart', this.createdDateStart + '');
    }

    if (this.createdDateEnd) {
      params.set('createdDateEnd', this.createdDateEnd + '');
    }

    if (this.charged != null) {
      params.set('charged', (this.charged === true) ? 'true' : 'false');
    }

    if(this.reprocess != null) {
      params.set('reprocess', (this.reprocess === true)? 'true' : 'false' );
    }

    if (this.stakeholders != null && this.stakeholders.length > 0) {

      let ids = '';

      for (const s of this.stakeholders) {

        if (ids != '') {
          ids += ',';
        }

        ids += s.id;
      }

      params.set('stakeholdersIds', ids);
    }

    return params;
  }
}
