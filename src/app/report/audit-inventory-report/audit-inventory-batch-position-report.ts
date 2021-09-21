export class AuditInventoryBatchPositionReport {
  static fromListData(listData: Array<AuditInventoryBatchPositionReport>): Array<AuditInventoryBatchPositionReport> {
    return listData.map((data) => {
      return AuditInventoryBatchPositionReport.fromData(data);
    });
  }

  static fromData(data: AuditInventoryBatchPositionReport): AuditInventoryBatchPositionReport {
    if (!data) return new this();
    let AuditInventoryBatchPositionReport = new this(
      data.strainer,
      data.positionCode,
      data.netWeight,
      data.netQuantity,
      data.serviceInstructionCode,
    );
    return AuditInventoryBatchPositionReport;
  }

  constructor(
    public strainer?: string,
    public positionCode?: string,
    public netWeight?: number,
    public netQuantity?: number,
    public serviceInstructionCode?: string,
  ) {
  }
}
