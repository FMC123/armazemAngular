import {AuditInventoryBatchPositionReport} from "./audit-inventory-batch-position-report";

export class AuditInventoryBatchReport {
  static fromListData(listData: Array<AuditInventoryBatchReport>): Array<AuditInventoryBatchReport> {
    return listData.map((data) => {
      return AuditInventoryBatchReport.fromData(data);
    });
  }

  static fromData(data: AuditInventoryBatchReport): AuditInventoryBatchReport {
    if (!data) return new this();
    let auditInventoryReport = new this(
      data.batchCode,
      data.strainer,
      data.netWeight,
      data.netQuantity,
      data.sacksOutProcess,
      data.sacksBalance,
      data.averageSackWeight,
      AuditInventoryBatchPositionReport.fromListData(data.positionInfo),
    );
    return auditInventoryReport;
  }

  constructor(
    public batchCode?: string,
    public strainer?: string,
    public netWeight?: number,
    public netQuantity?: number,
    public sacksOutProcess?: number,
    public sacksBalance?: number,
    public averageSackWeight?: number,
    public positionInfo?: Array<AuditInventoryBatchPositionReport>,
  ) {
  }
}
