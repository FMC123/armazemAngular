import { ServiceItem } from '../service-item/service-item';
import { DateTimeHelper, NumberHelper } from "../shared/globalization";
import {User} from "../user/user";
export class ServiceInstructionItem {

  static fromListData(
    listData: Array<ServiceInstructionItem>
  ): Array<ServiceInstructionItem> {
    return listData.map(data => {
      return ServiceInstructionItem.fromData(data);
    });
  }

  static fromData(data?: ServiceInstructionItem): ServiceInstructionItem {
    if (!data) {
      return new this();
    }

    let ServiceInstruction = new this(
      data.id,
      data.createdDate,
      data.item,
      data.unit,
      data.quantity,
      data.observation,
      data.serviceSacksQuantity,
      data.chargeSacksQuantity,
      data.chargeApproved,
      data.chargeApprovedBy,
      data.chargeMessage,
    );

    return ServiceInstruction;
  }

  constructor(
    public id?: string,
    public createdDate?: number,
    public item?: ServiceItem,
    public unit?: string,
    public quantity?: number,
    public observation?: string,
    public serviceSacksQuantity?: number,
    public chargeSacksQuantity?: number,
    public chargeApproved?: boolean,
    public chargeApprovedBy?: User,
    public chargeMessage?: string,
  ) {

    if (item) {
      this.item = ServiceItem.fromData(item);
    }

    if(chargeApprovedBy){
      this.chargeApprovedBy = User.fromData(chargeApprovedBy);
    }
  }

  get createdDateString(): string {
    return DateTimeHelper.toDDMMYYYYHHmm(this.createdDate);
  }
  set createdDateString(createdDateString: string) {
    this.createdDate = DateTimeHelper.fromDDMMYYYYHHmm(createdDateString);
  }

  get additionalServiceSacksQuantityString(): string {
    if(this.serviceSacksQuantity)
    {
      // return NumberHelper.toPTBR(this.serviceSacksQuantity);
      return this.serviceSacksQuantity.toString();
    }
    return "";
  }

  set additionalServiceSacksQuantityString(value) {
    this.serviceSacksQuantity = NumberHelper.fromPTBR(value);
  }

  set chargeSacksQuantityString(value) {
    this.chargeSacksQuantity = NumberHelper.fromPTBR(value);
  }
}
