import { FiscalNote } from "../../../fiscal-note/fiscal-note";

export class BatchOperationOwnershipTransfer {

  static fromData(data: any): BatchOperationOwnershipTransfer {
    if (!data) return new this();
    let batchOperationOwnershipTransfer = new this(
      data.warehouse,
      data.batchOrigin,
      data.batchDestiny,
      data.personDocumentRegistration,
      data.collaboratorRegistration,
      data.quantityTransfer,
      data.quantityBags,
      data.surplusTransfer,
      data.cancelTransfer,
      data.fiscalNotes,
      data.sellCode,
      data.note,
      data.calcManual,
      data.refClient,
      data.officialDate
    );
    return batchOperationOwnershipTransfer;
  }

  constructor(
    public warehouse?: String,
    public batchOrigin?: String,
    public batchDestiny?: String,
    public personDocumentRegistration?: String,
    public collaboratorRegistration?: String,
    public quantityTransfer?: String,
    public quantityBags?: String,
    public surplusTransfer?: Boolean,
    public cancelTransfer?: Boolean,
    public fiscalNotes?: FiscalNote[],
    public sellCode?: string,
    public note?: string,
    public calcManual?: boolean,
    public refClient?: string,
    public officialDate?: number
  ) { }
}
