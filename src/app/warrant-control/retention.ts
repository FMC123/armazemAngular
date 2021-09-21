import {WarehouseStakeholder} from "../warehouse-stakeholder/warehouse-stakeholder";
import {WarrantData} from "./warrant-data";
import {RetentionBatch} from "./retention-batch";
import {DateTimeHelper, NumberHelper} from "../shared/globalization";
import {RetentionStatus} from "./retention-status";
import { RetentionGroup } from "./retention-group";

export class Retention {

  static fromListData(listData: Array<any>): Array<Retention> {
    return listData.map(data => {
      return Retention.fromData(data);
    });
  }

  static fromData(data: any, options: any = {}): Retention {
    if (!data) {
      return new this();
    }

    let retention = new this(
      data.id,
      data.client,
      data.quantity,
      data.sacksQuantity,
      data.status,
      data.closeDate,
      data.retentionBatches,
      data.warrantData,
      data.code
    );
    return retention;
  }

  constructor(
    public id?: string,
    public client?:WarehouseStakeholder,
    public quantity?:number,
    public sacksQuantity?: number,
    public status?: string,
    public closeDate?: number,
    public retentionBatches?: RetentionBatch[],
    public warrantData?:WarrantData,
    public code?: string
  ) {

    if(client){
      this.client = WarehouseStakeholder.fromData(this.client);
    }

    if(warrantData){
      this.warrantData = WarrantData.fromData(this.warrantData);
    }

    if(retentionBatches && this.retentionBatches.length > 0){
      this.retentionBatches = RetentionBatch.fromListData(this.retentionBatches);
    }

  }


  get quantityString(){
    return NumberHelper.toPTBR(this.quantity);
  }

  get statusString(){
    return RetentionStatus.fromData(this.status).name;
  }
  get codeWarrant(){
    return Retention.fromData(this.code).code;
  }
  get closeDateString(){
    return DateTimeHelper.toDDMMYYYY(this.closeDate);
  }


}
