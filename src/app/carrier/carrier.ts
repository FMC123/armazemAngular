import { Person } from '../person/person';
import { Uf } from '../uf/uf';
import { City } from '../city/city';
import { Country } from '../country/country';

export class Carrier {

  static fromListData(listData: Array<Carrier>): Array<Carrier>{
    return listData.map((data) => {
      return Carrier.fromData(data);
    });
  }

  static fromData(data: Carrier): Carrier {
    if (!data) return new this();
    let carrier = new this(
      data.id,
      Person.fromData(data.person),
    );
    return carrier;
  }

  constructor(public id?: string,
              public person?: Person,
  ){}


}
