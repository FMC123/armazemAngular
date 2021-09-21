import { BatchReceiveType } from './batch-receive-type';
import { TypeCoffee } from './../pack-type/type-coffee';
import { PackType } from '../pack-type/pack-type';
import { Strainer } from '../strainer/strainer';
import { Drink } from '../drink/drink';
import { PositionType } from '../position/position-type';
import { StorageUnit } from '../storage-unit/storage-unit';
import { DateTimeHelper } from '../shared/globalization';
import { User } from '../user/user';
import { BatchOperation } from './../batch-operation/batch-operation';
import { NumberHelper } from './../shared/globalization/number-helper';
import { BatchStatus } from './batch-status';
import { Position } from '../position/position';
import { Sample } from 'app/sample/sample';
import { Warehouse } from '../warehouse/warehouse';
import { WarehouseStakeholder } from "../warehouse-stakeholder/warehouse-stakeholder";
import { BatchCertificate } from 'app/batch-certificate/batch-certificate';
import {Collaborator} from "../collaborator/collaborator";
import {now} from "moment";
import {AuthService} from "../auth/auth.service";
import { StringMapWrapper } from '@angular/core/src/facade/collection';

export class Batch {

  public position: Position;
  public availableWeightTemp: number = null;

  static fromListData(listData: Array<any>): Array<Batch> {
    return listData.map((data) => {
      return Batch.fromData(data);
    });
  }

  static fromData(data: any): Batch {
    if (!data) return new this();
    let batch = new this(
      data.id,
      data.batchCode,
      data.batchOperation,
      data.batchReference,
      data.status,
      data.strainer,
      data.drink,
      data.impurityContent,
      data.moistureContent,
      data.unitType,
      data.refClient,
      data.storageUnits,
      data.createdDate,
      data.createdBy,
      data.positionId,
      data.positionCode,
      data.positionName,
      data.positionType,
      data.deletedDate,
      data.netWeight,
      data.grossWeight,
      data.tareWeight,
      data.indDiscountPack,
      data.packType,
      data.storageType,
      data.typeCoffee,
      data.averageWeightSack,
      data.netQuantity,
      data.netQuantityTyped,
      data.contaminant,
      data.contaminants,
      data.receiveType,
      data.currentLocal,
      data.storageUnitBatchesQuantitySum,
      data.storageUnitBatchesQuantityRefSum,
      data.batchesCodeDestination,
      data.senderDestination,
      data.idSampleTracking,
      data.receivedAt,
      data.observation,
      data.sample,
      data.warehouse,
      data.owner,
      data.qtdReserved,
      data.outWarehouse,
      data.outProcess,
      data.outTransferOwnership,
      data.certificates,
      data.certificateNames,
      data.collaborator,
      data.drinkName,
      data.strainerName,
      data.qtdeEmb,
      data.qtdeIs,
      data.balanceCs,
      data.packQuantity,
      data.warrantReservedQtd
    );
    return batch;
  }

  constructor(
    public id?: string,
    public batchCode?: string,
    public batchOperation?: BatchOperation,
    public batchReference?: Batch,
    public status?: string,
    public strainer?: Strainer,
    public drink?: Drink,
    public impurityContent?: number,
    public moistureContent?: number,
    public unitType?: string,
    public refClient?: string,
    public storageUnits?: Array<StorageUnit | any>,
    public createdDate?: number,
    public createdBy?: User,
    public positionId?: string,
    public positionCode?: string,
    public positionName?: string,
    public positionType?: string,
    public deletedDate?: number,
    public netWeight?: number,
    public grossWeight?: number,
    public tareWeight?: number,
    public indDiscountPack?: boolean,
    public packType?: PackType,
    public storageType?: PackType,
    public typeCoffee?: string,
    public averageWeightSack?: number,
    public netQuantity?: number,
    public netQuantityTyped?: boolean,
    public contaminant?: boolean,
    public contaminants?: Array<String | any>,
    public receiveType?: string,
    public currentLocal?: string,
    public storageUnitBatchesQuantitySum?: number,
    public storageUnitBatchesQuantityRefSum?: number,
    public batchesCodeDestination?: Array<string>,
    public senderDestination?: WarehouseStakeholder,
    public idSampleTracking?: string,
    public receivedAt?: number,
    public observation?: string,
    public sample?: Sample,
    public warehouse?: Warehouse,
    public owner?: WarehouseStakeholder,
    public qtdReserved?: number,
    public outWarehouse?: number,
    public outProcess?: number,
    public outTransferOwnership?: number,
    public certificates?: Array<BatchCertificate>,
    public certificateNames? : string,
    public collaborator?: Collaborator,
    public drinkName?: string,
    public strainerName?: string,
    public qtdeEmb?: number,
    public qtdeIs?: number,
    public balanceCs?: number,
    public packQuantity?: number,
    public warrantReservedQtd?: number
  ) {
    if (positionId) {
      this.position = Position.fromData({
        id: positionId,
        code: positionCode,
        name: positionName,
        type: positionType,
      });
    }

    if (packType) {
      this.packType = PackType.fromData(packType);
    }

    if (storageType) {
      this.storageType = PackType.fromData(storageType);
    }

    if (batchOperation) {
      this.batchOperation = BatchOperation.fromData(batchOperation);
    }

    if (storageUnits) {
      this.storageUnits = StorageUnit.fromListData(storageUnits);
    }

    if (createdBy) {
      this.createdBy = User.fromData(createdBy);
    }

    if (sample) {
      this.sample = Sample.fromData(sample);
    }

    if (owner) {
      this.owner = WarehouseStakeholder.fromData(owner);
    } else {
      this.owner = new WarehouseStakeholder();
    }

    if (senderDestination) {
      this.senderDestination = WarehouseStakeholder.fromData(senderDestination);
    }

    if (strainer) {
      this.strainer = Strainer.fromData(strainer);
    }

    if (certificates) {
      this.certificates = BatchCertificate.fromListData(certificates);
    }

    if(collaborator) {
      this.collaborator = Collaborator.fromData(collaborator)
    }
  }

  get editable() {
    if ([BatchStatus.OPEN.code, BatchStatus.RECEIVING.code].findIndex(bs => bs === this.status) < 0) {
      return false;
    }

    return !this.position
      || !this.position.id
      || this.position.type === PositionType.MOEGA.code;
  }

  get impurityContentString(): string {
    return NumberHelper.toPTBR(this.impurityContent);
  }

  set impurityContentString(value) {
    this.impurityContent = NumberHelper.fromPTBR(value);
  }

  get moistureContentString(): string {
    return NumberHelper.toPTBR(this.moistureContent);
  }

  set moistureContentString(value) {
    this.moistureContent = NumberHelper.fromPTBR(value);
  }

  get netWeightString(): string {
    return NumberHelper.toPTBR(this.netWeight);
  }

  get netWeightCalcString(): string {

    if (!this.grossWeight) {
      this.grossWeight = 0;
    }

    if (!this.tareWeight) {
      this.tareWeight = 0;
    }

    this.netWeight = this.grossWeight - this.tareWeight;
    return NumberHelper.toPTBR(this.netWeight);
  }

  set netWeightString(value) {
    this.netWeight = NumberHelper.fromPTBR(value);
  }

  get statusObject(): BatchStatus {
    return BatchStatus.fromData(this.status);
  }
  set statusObject(value: BatchStatus) {
    if (value) {
      this.status = value.code;
    } else {
      this.status = null;
    }
  }

  get storageUnitsCount(): number {
    if (!this.storageUnits && this.storageUnits.length <= 0) {
      return 0;
    }
    return this.storageUnits.length;
  }

  get storageUnitsQuantity(): number {
    if (!this.storageUnitsCount) {
      return 0;
    }
    return this.storageUnits.map((b) => b.quantity)
      .reduce((a, b) => {
        return Number(a) + Number(b);
      }, 0);
  }

  get storageUnitsInitialWeightString(): string {
    return NumberHelper.toPTBR(this.storageUnitsQuantity);
  }

  get createdDateString(): string {
    return DateTimeHelper.toDDMMYYYYHHmm(this.createdDate);
  }
  set createdDateString(createdDateString: string) {
    this.createdDate = DateTimeHelper.fromDDMMYYYYHHmm(createdDateString);
  }

  get receivedAtString(): string {
    return this.receivedAt ? DateTimeHelper.toDDMMYYYYHHmm(this.receivedAt) : '';
  }

  get officialDateString(): string {
    return this.batchOperation && DateTimeHelper.toDDMMYYYYHHmm(this.batchOperation.officialDate);
  }

  set receivedAtString(receivedAtString: string) {
    this.receivedAt = DateTimeHelper.fromDDMMYYYYHHmm(receivedAtString);
  }

  get grossWeightString() {
    return NumberHelper.toPTBR(this.grossWeight);
  }

  set grossWeightString(value) {
    this.grossWeight = NumberHelper.fromPTBR(value);
  }

  get storageUnitBatchesQuantitySumString(): string {
    return NumberHelper.toPTBR(this.storageUnitBatchesQuantitySum);
  }

  set storageUnitBatchesQuantitySumString(value) {
    this.storageUnitBatchesQuantitySum = NumberHelper.fromPTBR(value);
  }

  get storageUnitBatchesQuantityRefSumString(): string {
    return NumberHelper.toPTBR(this.storageUnitBatchesQuantityRefSum);
  }

  set storageUnitBatchesQuantityRefSumString(value) {
    this.storageUnitBatchesQuantityRefSum = NumberHelper.fromPTBR(value);
  }

  get tareWeightString(): string {
    return NumberHelper.toPTBR(this.tareWeight);
  }

  set tareWeightString(value) {
    this.tareWeight = NumberHelper.fromPTBR(value);
  }

  get genericTypeCoffee() {
    return TypeCoffee.fromData(this.typeCoffee);
  }

  set typeCoffeeObject(value: TypeCoffee) {
    if (value) {
      this.typeCoffee = value.code;
    } else {
      this.typeCoffee = null;
    }
  }

  set receiveTypeObject(value: BatchReceiveType) {
    if (value) {
      this.receiveType = value.code;
    } else {
      this.receiveType = null;
    }
  }

  get receiveTypeObject() {
    return BatchReceiveType.fromData(this.receiveType);
  }

  get averageWeightBagsString(): string {
    return NumberHelper.toPTBR3Places(this.averageWeightSack);
  }

  get averageWeightBagsObject(): number {
    return this.averageWeightSack;
  }

  set setAverageWeightBags(value) {
    this.averageWeightSack = value;
  }

  get netQuantityValue() {
    if (this.netQuantity) {
      return String(this.netQuantity);
    } else {
      return '0';
    }
  }

  set netQuantityValue(value) {
    this.netQuantity = Number(value);
  }

  /**
   * Quantidade de sacas pelo peso médio
   */
  get sacks() {

    let sacks: number = null;

    if (this.averageWeightSack) {
      sacks = Math.round(this.balance / this.averageWeightSack);
    }

    // pelo menos 1 de tem balanço (para cáluclos que ficam com menos de 1: ex: 0,151...)
    if (this.balance > 0 && !sacks) {
      sacks = 1;
    }

    return sacks;
  }

  get availableSacks() {

    let sacks: number = null;

    if (this.averageWeightSack) {
      sacks = Math.round(this.availableWeight / this.averageWeightSack);
    }

    // pelo menos 1 de tem balanço (para cáluclos que ficam com menos de 1: ex: 0,151...)
    if (this.balance > 0 && !sacks) {
      sacks = 1;
    }

    return sacks;
  }

  get availableWeight(): number {

    let temp;

    if (this.availableWeightTemp != null) {
      temp = this.availableWeightTemp;
    }
    else {
      temp = this.balance;
    }

    if (temp < 0) {
      temp = 0;
    }

    return temp;
  }

  set availableWeight(availableWeight: number) {
    this.availableWeightTemp = availableWeight;
  }

  get availableWeightString(): string {
    return NumberHelper.toPTBR(this.availableWeight);
  }

  get balance(): number {
    let temp = this.netWeight - this.outProcess - this.outTransferOwnership - this.outWarehouse;
    if (this.indDiscountPack && this.packType && this.packQuantity){
      temp -= this.packType.weight * this.packQuantity;
    }
    if (temp < 0)
      temp = 0;
    return temp;
  }

  get balanceSacks(): number {
    if(this.averageWeightSack)
      return Math.round((this.balance - this.warrantReservedQtd)/this.averageWeightSack)
    else
      return this.balance > 0 ? 1 : 0;
  }

  get balanceString(): string {
    return NumberHelper.toPTBR(this.balance);
  }

  get balanceSacksString(): string {
    return NumberHelper.toPTBR(Math.round(this.balance/this.averageWeightSack));
  }

  get qtdReservedString(): string {
    return NumberHelper.toPTBR(this.qtdReserved);
  }

  get outWarehouseString(): string{
    return NumberHelper.toPTBR(this.outWarehouse);
  }

  get outProcessString(): string{
    return NumberHelper.toPTBR(this.outProcess);
  }

  get outTransferOwnershipString(): string{
    return NumberHelper.toPTBR(this.outTransferOwnership);
  }

  get local() {
    return this.warehouse.local;
  }

  localWithAuth(auth :AuthService) {
    return this.warehouse.local && auth.accessToken.warehouse.id === this.warehouse.id;
  }

  localStringWithAuth(auth :AuthService) {
    return (this.localWithAuth(auth)) ? 'Local' : 'Remoto: ' + this.warehouse.name;
  }

  get localString() {
    return (this.local) ? 'Local' : 'Remoto: ' + this.warehouse.name;
  }

  /**
   * Nomes dos certificados, separados por vírgula
   */
  get certificateNamesString() {

    let listNames = [];
    if (this.certificates == null || this.certificates.length < 1) {
      return '';
    }

    this.certificates.forEach(bc => {
      listNames.push(bc.certificate.name);
    });

    return listNames.join(', ');
  }

  get batchDays() {
    const mnow = moment(now());
    const mpast = moment(this.createdDate);
    const mduration = moment.duration(mnow.diff(mpast));
    return mduration.asDays().toFixed(0);
  }

}
