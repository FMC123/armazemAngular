import { Address } from '../address/address';

import { DateTimeHelper } from './../shared/globalization/date-time-helper';

export class Farm {

  static fromListData(listData: Array<Farm>): Array<Farm> {
    return listData.map((data) => {
      return Farm.fromData(data);
    });
  }

  static fromData(data: Farm): Farm {
    if (!data) return new this();
    let farm = new this(
      data.id,
      data.address,
      data.code,
      data.name,
      data.stateRegistration,
      data.cnpj,
      data.longitude,
      data.latitude,
      data.farmPercentage,
      data.farmSize,
      data.farmSizeUnit,
    );
    return farm;
  }

  constructor(public id?: string,
    public address?: Address,
    public code?: number,
    public name?: string,
    public stateRegistration?: string,
    public cnpj?: string,
    public longitude?: string,
    public latitude?: string,
    public farmPercentage?: string,
    public farmSize?: string,
    public farmSizeUnit?: string,
  ) {
  }


  get label() {
    return [this.name, this.code].filter(l => !!l).join(' - ');
  }
}