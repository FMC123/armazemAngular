import { DateTimeHelper } from '../shared/globalization/date-time-helper';

export class Uf {

  static fromListData(listData: Array<Uf>): Array<Uf> {
    return listData.map((data) => {
      return Uf.fromData(data);
    });
  }

  static fromData(data: Uf): Uf {
    if (!data) return new this();
    let uf = new this(
      data.id,
      data.ufInitials,
      data.name,
      data.capital,
      data.taxICMSPercent,
    );
    return uf;
  }

  constructor(public id?: string,
    public ufInitials?: number,
    public name?: string,
    public capital?: string,
    public taxICMSPercent?: string,
  ) { }


}
