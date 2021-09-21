import { WarehouseStakeholder } from '../warehouse-stakeholder/warehouse-stakeholder';
import { ServiceCharge } from './service-charge';
import { NumberHelper } from 'app/shared/globalization/number-helper';

export class ServiceChargeClient {

  static fromListData(listData: Array<ServiceChargeClient>): Array<ServiceChargeClient> {
    return listData.map((data) => {
      return ServiceChargeClient.fromData(data);
    });
  }

  static fromData(data: ServiceChargeClient): ServiceChargeClient {
    if (!data) return new this();
    let ServiceChargeClient = new this(
      data.client,
      data.serviceCharges,
      data.grandTotal,
      data.simpleTotal,
      data.totalIndustrialization
    );
    return ServiceChargeClient;
  }

  constructor(
    public client?: WarehouseStakeholder,
    public serviceCharges?: Array<ServiceCharge>,
    public grandTotal?: number,
    public simpleTotal?: number,
    public totalIndustrialization?: number
  ) {

    if (client) {
      this.client = WarehouseStakeholder.fromData(client);
    }

    this.serviceCharges = (serviceCharges) ?
      ServiceCharge.fromListData(serviceCharges)
      : [];
  }

  get grandTotalString(): string {
    return NumberHelper.toPTBR5Places(this.grandTotal);
  }

  get simpleTotalString(): string {
    return NumberHelper.toPTBR5Places(this.simpleTotal);
  }

  get totalIndustrializationString(): string {
    return NumberHelper.toPTBR5Places(this.totalIndustrialization);
  }
}