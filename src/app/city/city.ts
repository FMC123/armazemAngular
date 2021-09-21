import { DateTimeHelper } from './../shared/globalization/date-time-helper';
import { Uf } from 'app/uf/uf';

export class City {

  static fromListData(listData: Array<City>): Array<City> {
    return listData.map((data) => {
      return City.fromData(data);
    });
  }

  static fromData(data: City): City {
    if (!data) return new this();
    let city = new this(
      data.id,
      data.name,
      data.uf,
    );
    return city;
  }

  constructor(public id?: string,
    public name?: string,
    public uf?: Uf,
  ) { }


  get label() {
    let label = this.name;

    if (this.uf != null && this.uf.ufInitials != null) {
      label += '/' + this.uf.ufInitials;
    }

    return label;
  }
}