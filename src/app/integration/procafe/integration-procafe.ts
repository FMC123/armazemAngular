import {DateTimeHelper} from "../../shared/globalization";

export class IntegrationProcafe {

  static fromListData(listData: Array<IntegrationProcafe>): Array<IntegrationProcafe> {
    return listData.map((data) => {
      return IntegrationProcafe.fromData(data);
    });
  }

  static fromData(data: IntegrationProcafe): IntegrationProcafe {
    if (!data) {
      return new this();
    }

    let integrationProcafe = new this(
      data.id,
      data.proccessType,
      data.processDate,
      data.stringJson,
      data.errorMessage
    );

    return integrationProcafe;
  }

  constructor(
    public id?: string,
    public proccessType?: string,
    public processDate?: number,
    public stringJson?: string,
    public errorMessage?: string
  ) { }


  get dateString() {
    return DateTimeHelper.toDDMMYYYYHHmm(this.processDate);
  }


  get jsonFormatted() {
    try {
      return JSON.stringify(
        JSON.parse(this.stringJson),
        null,
        2
      );
    } catch (error) {
      return this.stringJson;
    }
  }


}
