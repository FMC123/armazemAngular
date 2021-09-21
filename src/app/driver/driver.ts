import {DateTimeHelper} from "../shared/globalization";

export class Driver {

  static fromListData(listData: Array<Driver>): Array<Driver>{
    return listData.map((data) => {
      return Driver.fromData(data);
    });
  }

  static fromData(data: Driver): Driver {
    if (!data) return new this();
    let driver = new this(
      data.id,
      data.name,
      data.cpf,
      data.cnh,
      data.cnhExpirationDate,
      data.cellPhone,
      data.blocked,
      data.observation
    );
    return driver;
  }

  constructor(public id?: string,
              public name?: string,
              public cpf?: string,
              public cnh?: string,
              public cnhExpirationDate?: number,
              public cellPhone?: string,
              public blocked?: boolean,
              public observation?: string,
  ){}

  get cnhExpirationDateString() {
    if (!this.cnhExpirationDate) {
      return null;
    }

    return DateTimeHelper.toDDMMYYYY(this.cnhExpirationDate);
  }

  set cnhExpirationDateString(value) {
    this.cnhExpirationDate = DateTimeHelper.fromDDMMYYYY(value);
  }

  get label() {
    return this.name;
  }
}
