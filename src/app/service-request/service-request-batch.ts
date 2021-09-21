import { Batch } from '../batch/batch';

export class ServiceRequestBatch {

  static fromListData(listData: Array<ServiceRequestBatch>): Array<ServiceRequestBatch> {
    return listData.map((data) => {
      return ServiceRequestBatch.fromData(data);
    });
  }

  static fromData(data?: ServiceRequestBatch): ServiceRequestBatch {
    if (!data) {
      return new this();
    }

    let serviceRequestBatch = new this(
      data.id,
      data.quantity,
      data.weight,
      data.batch,
      data.batchCode
    );

    return serviceRequestBatch;
  }

  constructor(
    public id?: string,
    public quantity?: number,
    public weight?: number,
    public batch?: Batch,
    public batchCode?: string
  ) {
    if (batch) {
      this.batch = Batch.fromData(batch);
    }
  }
}