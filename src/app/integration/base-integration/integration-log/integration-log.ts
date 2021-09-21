import { DateTimeHelper } from '../../../shared/globalization/index';
import {Warehouse} from "../../../warehouse/warehouse";
export class IntegrationLog {

  static fromListData(listData: Array<IntegrationLog>): Array<IntegrationLog> {
    return listData.map((data) => {
      return IntegrationLog.fromData(data);
    });
  }

  static fromData(data: IntegrationLog): IntegrationLog {
    if (!data) return new this();
    let functionLogAx = new this(
      data.createdDate,
      data.id,
      data.integrationId,
      data.url,
      data.integrationContent,
      data.integrationResponse,
      data.requestType,
      data.integrationType,
      data.status,
      data.integrationDate,
      data.direction,
      data.warehouseToFrom,
      data.integrationDateCheck
    );
    return functionLogAx;
  }

  constructor(
    public createdDate?: number,
    public id?: string,
    public integrationId?: string,
    public url?: string,
    public integrationContent?: string,
    public integrationResponse?: string,
    public requestType?: string,
    public integrationType?: string,
    public status?: string,
    public integrationDate?: number,
    public direction?: string,
    public warehouseToFrom?: Warehouse,
    public integrationDateCheck?: string
  ) {

    if(warehouseToFrom){
      this.warehouseToFrom = Warehouse.fromData(warehouseToFrom);
    }

  }

  get integrationDateString() {
    return DateTimeHelper.toDDMMYYYYHHmm(this.integrationDate);
  }

  get createdDateString() {
    return DateTimeHelper.toDDMMYYYYHHmm(this.createdDate);
  }

  get integrationContentFormatted() {
    try {
      return JSON.stringify(
        JSON.parse(this.integrationContent),
        null,
        2
      );
    } catch (error) {
      return this.integrationContent;
    }
  }

  get integrationResponseFormatted() {
    try {
      return JSON.stringify(
        JSON.parse(this.integrationResponse),
        null,
        2
      );
    } catch (error) {
      return this.integrationResponse;
    }
  }

}
