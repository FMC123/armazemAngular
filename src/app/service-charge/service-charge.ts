import { Drink } from '../drink/drink';
import { BatchOperation } from '../batch-operation/batch-operation';
import { WarehouseStakeholder } from '../warehouse-stakeholder/warehouse-stakeholder';
import { ServiceItem } from '../service-item/service-item';
import { DateTimeHelper, NumberHelper } from '../shared/globalization';
import { ServiceInstruction } from 'app/service-instruction/service-instruction';
import {User} from "../user/user";

export class ServiceCharge {

  static fromListData(listData: Array<ServiceCharge>): Array<ServiceCharge> {
    return listData.map((data) => {
      return ServiceCharge.fromData(data);
    });
  }

  static fromData(data: ServiceCharge): ServiceCharge {
    if (!data) return new this();
    let serviceCharge = new this(
      data.id,
      data.createdDate,
      data.owner,
      data.batchOperation,
      data.serviceItem,
      data.drink,
      data.serviceItemQuantity,
      data.serviceItemSackQuantity,
      data.unitType,
      data.balanceDayInit,
      data.balanceOut,
      data.balanceIn,
      data.balanceProcessing,
      data.weightBalanceDayInit,
      data.weightBalanceOut,
      data.weightBalanceIn,
      data.weightBalanceProcessing,
      data.price,
      data.chargedAt,
      data.referenceDate,
      data.serviceInstruction,
      data.automaticProcess,
      data.observation,
      data.approved,
      data.approvedBy,
    );
    return serviceCharge;
  }

  constructor(public id?: string,
    public createdDate?: number,
    public owner?: WarehouseStakeholder,
    public batchOperation?: BatchOperation,
    public serviceItem?: ServiceItem,
    public drink?: Drink,
    public serviceItemQuantity?: number,
    public serviceItemSackQuantity?: number,
    public unitType?: string,
    public balanceDayInit?: number,
    public balanceOut?: number,
    public balanceIn?: number,
    public balanceProcessing?: number,
    public weightBalanceDayInit?: number,
    public weightBalanceOut?: number,
    public weightBalanceIn?: number,
    public weightBalanceProcessing?: number,
    public price?: number,
    public chargedAt?: number,
    public referenceDate?: number,
    public serviceInstruction?: ServiceInstruction,
    public automaticProcess?: boolean,
    public observation?: string,
    public approved?: boolean,
    public approvedBy?: User,
  ) {

    if (owner) {
      this.owner = WarehouseStakeholder.fromData(owner);
    }

    if (batchOperation) {
      this.batchOperation = BatchOperation.fromData(batchOperation);
    }

    if (serviceItem) {
      this.serviceItem = ServiceItem.fromData(serviceItem);
    }

    if (drink) {
      this.drink = Drink.fromData(drink);
    }

    if (serviceInstruction) {
      this.serviceInstruction = ServiceInstruction.fromData(serviceInstruction);
    }

    if(approvedBy){
      this.approvedBy = User.fromData(approvedBy);
    }
  }

  get createdDateString(): string {
    return DateTimeHelper.toDDMMYYYY(this.createdDate);
  }

  get chargedAtString(): string {
    return DateTimeHelper.toDDMMYYYYHHmm(this.chargedAt);
  }

  get referenceDateString(): string {
    return DateTimeHelper.toDDMMYYYY(this.referenceDate);
  }

  set referenceDateString(referenceDateString: string) {
    this.referenceDate = DateTimeHelper.fromDDMMYYYY(referenceDateString);
  }

  get priceFormat(): string {
    return NumberHelper.toPTBR5Places(this.price);
  }

  set priceString(value) {
    this.price = NumberHelper.fromPTBR(value);
  }
}
