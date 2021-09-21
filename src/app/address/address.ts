import { Country } from '../country/country';
import { City } from '../city/city';
import { Uf } from '../uf/uf';
import { Person } from '../person/person';
import { DateTimeHelper } from './../shared/globalization/date-time-helper';
import { TypeAddress } from './type-address';
import { Formatter } from './../shared/forms/formatter/Formatter';

export class Address {
  tempId: string;

  static fromListData(listData: Array<Address>): Array<Address> {
    return listData.map((data) => {
      return Address.fromData(data);
    });
  }

  static fromData(data: Address): Address {
    if (!data) { return new this(); }
    let Address = new this(
          data.id,
          data.person,
          data.publicPlace,
          data.number,
          data.complement,
          data.neighbourhood,
          data.zipCode,
          data.country,
          data.city,
          data.uf,
          data.typeAddress,
          data.main,
    );
    return Address;
  }

  constructor(public id?: string,
              public person?: Person,
              public publicPlace?: string,
              public number?: number,
              public complement?: string,
              public neighbourhood?: string,
              public zipCode?: string,
              public country?: Country,
              public city?: City,
              public uf?: Uf,
              public typeAddress?: TypeAddress,
              public main ?: boolean,
              ) {}

  get zipCodeFormat() {
    return Formatter.zipCodeFormat(this.zipCode);
  }
}
