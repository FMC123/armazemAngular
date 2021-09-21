import {AuditInventoryBatchReport} from "./audit-inventory-batch-report";

export class AuditInventoryReport {
  static fromListData(listData: Array<AuditInventoryReport>): Array<AuditInventoryReport> {
    return listData.map((data) => {
      return AuditInventoryReport.fromData(data);
    });
  }

  static fromData(data: AuditInventoryReport): AuditInventoryReport {
    if (!data) return new this();
    let auditInventoryReport = new this(
      data.owner,
      data.createdDate,
      AuditInventoryBatchReport.fromListData(data.batches)
    );
    return auditInventoryReport;
  }

  constructor(
    public owner?: string,
    public createdDate?: any,
    public batches?: any,
  ) {
  }
}
