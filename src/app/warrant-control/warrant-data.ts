import {PackType} from "../pack-type/pack-type";
import {Retention} from "./retention";
import {ServiceItem} from "../service-item/service-item";
import {DateTimeHelper} from "../shared/globalization";

export class WarrantData {
  static fromListData(listData: Array<any>): Array<WarrantData> {
    return listData.map(data => {
      return WarrantData.fromData(data);
    });
  }

  static fromData(data: any, options: any = {}): WarrantData {
    if (!data) {
      return new this();
    }

    let warrantData = new this(
      data.id,
      data.retention,
      data.emissionDate,
      data.expires,
      data.expiresExtension,
      data.packType,
      data.storageService,
      data.insuranceService,
      data.expeditionService,
      data.endorsementText,
    );
    return warrantData;
  }

  constructor(
    public id?: string,
    public retention?: Retention,
    public emissionDate?: number,
    public expires?: number,
    public expiresExtension?: number,
    public packType?: PackType,
    public storageService?:ServiceItem,
    public insuranceService?:ServiceItem,
    public expeditionService?:ServiceItem,
    public endorsementText?: string
  ) {

    if(storageService){
      this.storageService = ServiceItem.fromData(this.storageService);
    }
    if(insuranceService){
      this.insuranceService = ServiceItem.fromData(this.insuranceService);
    }
    if(expeditionService){
      this.expeditionService = ServiceItem.fromData(this.expeditionService);
    }
    if(retention){
      this.retention = Retention.fromData(this.retention);
    }
    if(packType){
      this.packType = PackType.fromData(this.packType);
    }
  }

  get expiresCorrectDateToString(){
    if(this.expiresExtension && this.expiresExtension > this.expires){
      return DateTimeHelper.toDDMMYYYY(this.expiresExtension);
    }
    return DateTimeHelper.toDDMMYYYY(this.expires);
  }

  get expiresToString(){
    return DateTimeHelper.toDDMMYYYY(this.expires);
  }

  get emissionDateString(){
    return DateTimeHelper.toDDMMYYYY(this.emissionDate);
  }

  get useExpiresExtension(){
    return (this.expiresExtension && this.expiresExtension > this.expires);
  }

  get dateExpired(){
    const currentDate = new Date().getTime();
    if(this.expiresExtension && this.expiresExtension > this.expires){
      return this.expiresExtension < currentDate;
    }
    return this.expires < currentDate;

  }
}
