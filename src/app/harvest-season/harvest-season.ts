import {DateTimeHelper} from "../shared/globalization";

export class HarvestSeason {

  static fromListData(listData: Array<HarvestSeason>): Array<HarvestSeason> {
    return listData.map((data) => {
      return HarvestSeason.fromData(data);
    });
  }

  static fromData(data: HarvestSeason): HarvestSeason {
    if (!data) return new this();

    return new this(
      data.id,
      data.identifier,
      data.initialDate,
      data.finalDate,
    );
  }

  constructor(
    public id?: string,
    public identifier?: string,
    public initialDate?: number,
    public finalDate?: number,
  ) {
  }


  get initialDateString() {
    return DateTimeHelper.toDDMMYYYY(this.initialDate);
  }

  set initialDateString(value) {
    this.initialDate = DateTimeHelper.fromDDMMYYYY(value);
  }


  get finalDateString() {
    return DateTimeHelper.toDDMMYYYY(this.finalDate);
  }

  set finalDateString(value) {
    this.finalDate = DateTimeHelper.fromDDMMYYYY(value);
  }


}
