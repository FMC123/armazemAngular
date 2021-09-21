import {Retention} from "./retention";
import {Batch} from "../batch/batch";
import {NumberHelper} from "../shared/globalization";

export class RetentionBatch {
  static fromListData(listData: Array<any>): Array<RetentionBatch> {
    return listData.map(data => {
      return RetentionBatch.fromData(data);
    });
  }

  static fromData(data: any, options: any = {}): RetentionBatch {
    if (!data) {
      return new this();
    }

    let retentionBatch = new this(
      data.id,
      data.retention,
      data.batch,
      data.quantity,
      data.sacksQuantity,
    );
    return retentionBatch;
  }

  constructor(
    public id?: string,
    public retention?:Retention,
    public batch?:Batch,
    public quantity?:number,
    public sacksQuantity?: number,
  ) {

    if(batch){
      this.batch = Batch.fromData(this.batch);
    }

  }

  get quantityString(){
    return NumberHelper.toPTBR(this.quantity);
  }

}
