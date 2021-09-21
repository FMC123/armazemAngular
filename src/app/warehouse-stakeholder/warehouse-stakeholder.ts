import { Person } from '../person/person';
import { ServiceGroup } from '../service-group/service-group';
import { ServiceItem } from '../service-item/service-item';

export class WarehouseStakeholder {

  static fromListData(listData: Array<any>): Array<WarehouseStakeholder> {
    return listData.map((data) => {
      return WarehouseStakeholder.fromData(data);
    });
  }

  static fromData(data: WarehouseStakeholder): WarehouseStakeholder {
    if (!data) return new this();
    let warehouseStakeholder = new this(
      data.id,
      data.code,
      data.chargeType,
      data.generateCharging,
      data.inChargePeriodGrace,
      data.rebenefitChargePeriodGrace,
      data.indDust,
      data.indRock,
      data.indSample,
      data.observation1,
      data.observation2,
      data.observation3,
      data.gsSampleQty,
      data.inSampleQty,
      data.outSampleQty,
      data.chargePackLoadUnload,
      data.storageService,
      data.insuranceService,
      data.storageServiceCarencia,
      data.insuranceServiceCarencia,
      data.rentService,
      data.serviceGroup,
      data.person,
      data.checkServiceGuideClosing,
      data.weightAverage,
      data.collaboratorRegistration
    );
    return warehouseStakeholder;
  }

  constructor(public id?: string,
    public code?: string,
    public chargeType?: string,
    public generateCharging?: string,
    public inChargePeriodGrace?: number,
    public rebenefitChargePeriodGrace?: number,
    public indDust?: Boolean,
    public indRock?: Boolean,
    public indSample?: Boolean,
    public observation1?: string,
    public observation2?: string,
    public observation3?: string,
    public gsSampleQty?: number,
    public inSampleQty?: number,
    public outSampleQty?: number,
    public chargePackLoadUnload?: Boolean,
    public storageService?: ServiceItem,
    public insuranceService?: ServiceItem,
    public storageServiceCarencia?: ServiceItem,
    public insuranceServiceCarencia?: ServiceItem,
    public rentService?: ServiceItem,
    public serviceGroup?: ServiceGroup,
    public person?: Person, // TODO montar objeto de person, feito isso apenas para nao quebrar outras coisas
    public checkServiceGuideClosing?: boolean,
    public weightAverage?: number,
    public collaboratorRegistration?: string
  ) {

    if (storageService) {
      this.storageService = ServiceItem.fromData(storageService);
    }

    if (insuranceService) {
      this.insuranceService = ServiceItem.fromData(insuranceService);
    }

    if (storageServiceCarencia) {
      this.storageServiceCarencia = ServiceItem.fromData(storageServiceCarencia);
    }

    if (insuranceServiceCarencia) {
      this.insuranceServiceCarencia = ServiceItem.fromData(insuranceServiceCarencia);
    }

    if (rentService) {
      this.rentService = ServiceItem.fromData(rentService);
    }

    if (serviceGroup) {
      this.serviceGroup = ServiceGroup.fromData(serviceGroup);
    }

    if (person) {
      this.person = Person.fromData(person);
    }
  }

  get label() {

    if (!this.person) {
      return null;
    }

    let retorno = this.person.name;

    if (this.collaboratorRegistration) {
      retorno = this.collaboratorRegistration + ' - ' + retorno;
    }

    if (this.person.documentFormat) {
      retorno += ' - ' + this.person.documentFormat;
    }

    return retorno;
  }

  get labelWithoutDocument() {

    if (!this.person) {
      return null;
    }

    let retorno = this.person.name;

    if (this.collaboratorRegistration) {
      retorno = this.collaboratorRegistration + ' - ' + retorno;
    }

    return retorno;
  }
}
