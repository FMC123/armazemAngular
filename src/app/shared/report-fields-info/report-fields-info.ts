import { Warehouse } from "app/warehouse/warehouse";
import { Company } from "app/company/company";

export class ReportFieldsInfo {

  static fromListData(listData: Array<ReportFieldsInfo>): Array<ReportFieldsInfo> {
    return listData.map((data) => {
      return ReportFieldsInfo.fromData(data);
    });
  }

  static fromData(data: ReportFieldsInfo): ReportFieldsInfo {
    if (!data) return new this();
    let obj = new this(
      data.id,
      data.company,
      data.warehouse,
      data.name,
      data.cnpj,
      data.stateRegistration,
      data.phone,
      data.address,
      data.foundationInfo,
      data.warehouseManager,
      data.prosecutor,
      data.endorsement,
      data.logo1x1Filename,
      data.logo4x1Filename,
      data.logo1x1ContentType,
      data.logo4x1ContentType,
      data.logo1x1Bytes,
      data.logo4x1Bytes,
    );
    return obj;
  }


  constructor(
    public id?: string,
    public company?: Company,
    public warehouse?: Warehouse,
    public name?: string,
    public cnpj?: string,
    public stateRegistration?: string,
    public phone?: string,
    public address?: string,
    public foundationInfo?: string,
    public warehouseManager?: string,
    public prosecutor?: string,
    public endorsement?: string,
    public logo1x1Filename?: string,
    public logo4x1Filename?: string,
    public logo1x1ContentType?: string,
    public logo4x1ContentType?: string,
    public logo1x1Bytes?: string,
    public logo4x1Bytes?: string,
    public removeLogo1x1?: boolean,
    public removeLogo4x1?: boolean
  ) {

    if (company) {
      this.company = Company.fromData(company);
    }

    if (warehouse) {
      this.warehouse = Warehouse.fromData(warehouse);
    }
  }
}
