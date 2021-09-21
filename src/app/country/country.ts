import { DateTimeHelper } from './../shared/globalization/date-time-helper';

export class Country {

  static fromListData(listData: Array<Country>): Array<Country> {
    return listData.map((data) => {
      return Country.fromData(data);
    });
  }

  static fromData(data: Country): Country {
    if (!data) return new this();
    let country = new this(
          data.id,
          data.code,
          data.name,
    );
    return country;
  }

  constructor(public id?: string,
              public code?: number,
              public name?: string,
) {}


}
