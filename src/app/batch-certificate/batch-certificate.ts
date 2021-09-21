import { Batch } from "app/batch/batch";
import { Certificate } from "app/certificate/certificate";

export class BatchCertificate {

  static fromListData(listData: Array<any>): Array<BatchCertificate> {
    return listData.map((data) => {
      return BatchCertificate.fromData(data);
    });
  }

  static fromData(data: any): BatchCertificate {
    if (!data) return new this();
    let batch = new this(
      data.batch,
      data.certificate
    );
    return batch;
  }

  constructor(
    public batch?: Batch,
    public certificate?: Certificate
  ) {

    if (batch) {
      this.batch = Batch.fromData(batch);
    }

    if (certificate) {
      this.certificate = Certificate.fromData(certificate);
    }
  }
}