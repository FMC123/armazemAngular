import {WarehouseStakeholder} from "../warehouse-stakeholder";
import {Certificate} from "../../certificate/certificate";
import {DateTimeHelper} from "../../shared/globalization";
import {O_WRONLY} from "constants";

export class WarehouseStakeholderCertificate {

  static fromListData(listData: Array<any>): Array<WarehouseStakeholderCertificate> {
    return listData.map((data) => {
      return WarehouseStakeholderCertificate.fromData(data);
    });
  }

  static fromData(data: WarehouseStakeholderCertificate): WarehouseStakeholderCertificate {
    if (!data) return new this();
    let warehouseStakeholderCertificate = new this(
      data.id,
      data.owner,
      data.certificate,
      data.certifiedCustodyCode,
      data.certifiedCustodyExpirationDate,
      data.certifiedOriginCode,
      data.certifiedOriginExpirationDate,
    );
    return warehouseStakeholderCertificate;
  }

  constructor(
    public id?: string,
    public owner?: WarehouseStakeholder,
    public certificate?: Certificate,
    public certifiedCustodyCode?: string,
    public certifiedCustodyExpirationDate?: number,
    public certifiedOriginCode?: string,
    public certifiedOriginExpirationDate?: number,
  ) {

    if(owner){
      this.owner = WarehouseStakeholder.fromData(owner);
    }

    if(certificate){
      this.certificate = Certificate.fromData(certificate);
    }
  }

  get certificateName(): string {
    return this.certificate.name || '';
  }

  get certifiedCustodyExpirationDateString(): string {
    return DateTimeHelper.toDDMMYYYY(this.certifiedCustodyExpirationDate);
  }

  get certifiedOriginExpirationDateString(): string {
    return DateTimeHelper.toDDMMYYYY(this.certifiedOriginExpirationDate);
  }
}
