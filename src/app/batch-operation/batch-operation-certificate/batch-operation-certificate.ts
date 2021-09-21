import { Certificate } from '../../certificate/certificate';
import { BatchOperation } from '../batch-operation';

export class BatchOperationCertificate {

    static fromListData(listData: Array<BatchOperationCertificate>): Array<BatchOperationCertificate>{
      return listData.map((data) => {
        return BatchOperationCertificate.fromData(data);
      });
    }

    static fromData(data: BatchOperationCertificate): BatchOperationCertificate {
      if (!data) return new this();
      let batchOperationCertificate = new this(
        data.id,
        data.batchOperation,
        data.certificate,
        data.certifiedCustodyCode,
        data.certifiedOriginCode,
        data.deletedDate,
      );
      return batchOperationCertificate;
    }

    constructor(
      public id?: string,
      public batchOperation?: BatchOperation,
      public certificate?: Certificate,
      public certifiedCustodyCode?: string,
      public certifiedOriginCode?: string,
      public deletedDate?: number
    ) {
      this.batchOperation = BatchOperation.fromData(batchOperation);
      this.certificate = Certificate.fromData(certificate);
    }

  }
