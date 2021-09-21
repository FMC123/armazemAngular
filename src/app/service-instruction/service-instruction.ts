import { DateTimeHelper, NumberHelper } from '../shared/globalization';
import { User } from '../user/user';
import { Warehouse } from '../warehouse/warehouse';
import { ServiceInstructionType } from '../service-instruction-type/service-instruction-type';
import { MarkupGroup } from '../markup-group/markup-group';
import { SampleTracking } from '../sample-tracking/sample-tracking';
import { MarkupGroupBatch } from '../markup-group/batch/markup-group-batch';
import { ServiceInstructionItem } from './service-instruction-item';
import { ServiceInstructionStatus } from './service-instruction-status';
import { ExpectedResult } from './expected-result';
import { ServiceInstructionTypePurpose } from '../service-instruction-type/service-instruction-type-purpose';
import { WarehouseStakeholder } from "../warehouse-stakeholder/warehouse-stakeholder";
import { ServiceRequest } from 'app/service-request/service-request';
import {Collaborator} from "../collaborator/collaborator";
import {ServiceOrder} from "../service-order/service-order";

export class ServiceInstruction {

  // para verificar se a busca de lotes é por liga
  public searchForLeague: boolean = false;

  static fromListData(
    listData: Array<ServiceInstruction>
  ): Array<ServiceInstruction> {
    return listData.map(data => {
      return ServiceInstruction.fromData(data);
    });
  }

  static fromData(data?: ServiceInstruction): ServiceInstruction {
    if (!data) {
      return new this();
    }

    let ServiceInstruction = new this(
      data.id,
      data.code,
      data.name,
      data.responsable,
      data.clientReferenceCode,
      data.type,
      data.subtype,
      data.status,
      data.openedDate,
      data.closedDate,
      data.markupGroup,
      data.services,
      data.batchesIn,
      data.expectedResults,
      data.destinationWarehouse,
      data.observation,
      data.observation2,
      data.sampleTracking,
      data.sacksQuantity,
      data.clientStakeholder,
      data.collaborator,
      data.lossBySolid,
      data.lossByDust,
      data.sampleWithdrawal,
      data.serviceRequest,
      data.indicationSpecialCoffee,
      data.totalSacksQuantity,
      data.totalWeight,
      data.sacksDifference,
      data.weightDifference,
      data.averageWeightBag,
      data.proportionalDumpingSteps,
      data.averageMonetaryValue,
      data.proportionalDumpingObservation,
      data.serviceOrders,
      data.hasTraceableContaminant,
      data.serviceInstructionId,
    );
    return ServiceInstruction;
  }

  constructor(
    public id?: string,
    public code?: string,
    public name?: string,
    public responsable?: User,
    public clientReferenceCode?: string,
    public type?: ServiceInstructionType,
    public subtype?: string,
    public status?: string,
    public openedDate?: number,
    public closedDate?: number,
    public markupGroup?: MarkupGroup,
    public services?: ServiceInstructionItem[],
    public batchesIn?: MarkupGroupBatch[],
    public expectedResults?: ExpectedResult[],
    public destinationWarehouse?: Warehouse,
    public observation?: string,
    public observation2?: string,
    public sampleTracking?: SampleTracking,
    public sacksQuantity?: number,
    public clientStakeholder?: WarehouseStakeholder,
    public collaborator?: Collaborator,
    public lossBySolid?: number,
    public lossByDust?: number,
    public sampleWithdrawal?: number,
    public serviceRequest?: ServiceRequest,
    public indicationSpecialCoffee?: boolean,
    public totalSacksQuantity?: number,
    public totalWeight?: number,
    public sacksDifference?: number,
    public weightDifference?: number,
    public averageWeightBag?: number,
    public proportionalDumpingSteps?: number,
    public averageMonetaryValue?: number,
    public proportionalDumpingObservation?: string,
    public serviceOrders?: Array<ServiceOrder>,
    public hasTraceableContaminant?: boolean,
    public serviceInstructionId?: any,
  ) {

    if (type) {
      this.type = ServiceInstructionType.fromData(type);
    }

    if (destinationWarehouse) {
      this.destinationWarehouse = Warehouse.fromData(destinationWarehouse);
    }

    if (responsable) {
      this.responsable = User.fromData(responsable);
    }

    if (markupGroup) {
      this.markupGroup = MarkupGroup.fromData(markupGroup);
    }

    this.services = (services) ?
      ServiceInstructionItem.fromListData(services)
      : [];

    this.expectedResults = (expectedResults) ?
      ExpectedResult.fromListData(expectedResults)
      : [];

    if (clientStakeholder) {
      this.clientStakeholder = WarehouseStakeholder.fromData(clientStakeholder);
    }

    if (collaborator) {
      this.collaborator = Collaborator.fromData(collaborator);
    }

    if (serviceRequest) {
      this.serviceRequest = ServiceRequest.fromData(serviceRequest);
    }

    if (sampleTracking) {
      this.sampleTracking = SampleTracking.fromData(sampleTracking);
    }

    if (serviceOrders) {
      this.serviceOrders = ServiceOrder.fromListData(serviceOrders);
    } else {
      this.serviceOrders = [];
    }
  }

  get openedDateString(): string {
    return DateTimeHelper.toDDMMYYYY(this.openedDate);
  }

  set openedDateString(openedDateString: string) {
    this.openedDate = DateTimeHelper.fromDDMMYYYY(openedDateString);
  }

  get closedDateString(): string {
    return DateTimeHelper.toDDMMYYYY(this.closedDate);
  }

  set closedDateString(closedDateString: string) {
    this.closedDate = DateTimeHelper.fromDDMMYYYY(closedDateString);
  }

  get statusObject() {
    return ServiceInstructionStatus.fromData(this.status);
  }

  get lossBySolidString(): string {
    return NumberHelper.toPTBR(this.lossBySolid);
  }

  set lossBySolidString(value) {
    this.lossBySolid = NumberHelper.fromPTBR(value);
  }

  get lossByDustString(): string {
    return NumberHelper.toPTBR(this.lossByDust);
  }

  set lossByDustString(value) {
    this.lossByDust = NumberHelper.fromPTBR(value);
  }

  get sampleWithdrawalString(): string {
    return NumberHelper.toPTBR(this.sampleWithdrawal);
  }

  set sampleWithdrawalString(value) {
    this.sampleWithdrawal = NumberHelper.fromPTBR(value);
  }

  //get batchesIn() {
  //  return (this.markupGroup) ? this.markupGroup.batches : [];
  //}

  get isTransference() {
    return this.type &&
      this.type.purposeObject &&
      ServiceInstructionTypePurpose.TRANSFERENCE.code ===
      this.type.purposeObject.code;
  }

  get isRebenefit() {
    return this.type &&
      this.type.purposeObject &&
      ( ServiceInstructionTypePurpose.REBENEFIT.code === this.type.purposeObject.code ||
        ServiceInstructionTypePurpose.FUSION.code === this.type.purposeObject.code );
  }

  get isCharge() {
    return this.type && this.type.purposeObject
      && ServiceInstructionTypePurpose.CHARGE.code === this.type.purposeObject.code;
  }

  get isForSale(){
    return this.type &&
      this.type.purposeObject &&
      ServiceInstructionTypePurpose.FOR_SALE.code ===
      this.type.purposeObject.code;
  }

  get averageWeightBagString(): string {
    return NumberHelper.toPTBR(this.averageWeightBag);
  }

  set averageWeightBagString(value) {
    this.averageWeightBag = NumberHelper.fromPTBR(value);
  }

  get indicationSpecialCoffeeString(): string {
    return (this.indicationSpecialCoffee == true) ? 'true' : ((this.indicationSpecialCoffee == false) ? 'false' : '');
  }

  set indicationSpecialCoffeeString(value) {
    this.indicationSpecialCoffee = (value == 'true') ? true : ((value == 'false') ? false : null);
  }

  get weightDifferenceString(): string {
    return NumberHelper.toPTBR(this.weightDifference);
  }

  set weightDifferenceString(value) {
    this.weightDifference = NumberHelper.fromPTBR(value);
  }

  get sacksDifferenceString(): string {
    return (this.sacksDifference) ? this.sacksDifference + '' : '0';
  }

  set sacksDifferenceString(value) {
    this.sacksDifference = NumberHelper.fromPTBR(value);
  }

  get proportionalDumpingStepsString(): string {
    return (this.proportionalDumpingSteps) ? this.proportionalDumpingSteps + '' : '';
  }

  set proportionalDumpingStepsString(value) {
    this.proportionalDumpingSteps = NumberHelper.fromPTBR(value);
  }

  get isConfirmed() {
    return this
      && this.id
      && this.status
      && this.status === ServiceInstructionStatus.CONFIRMED.code;
  }

  get isOpened() {
    return this
      && this.id
      && this.status
      && this.status === ServiceInstructionStatus.OPENED.code;
  }

  get isInProgress() {
    return this
      && this.id
      && this.status
      && this.status === ServiceInstructionStatus.IN_PROCESS.code;
  }

  get isAwaitingBatchAvailability() {
    return this
      && this.id
      && this.status
      && this.status === ServiceInstructionStatus.AWAITING_BATCH.code;
  }

  get isAwaitingConfirmation() {
    return this
      && this.id
      && this.status
      && this.status === ServiceInstructionStatus.AWAITING_CONFIRM.code;
  }

  get isNewOrOpened() {
    return this
      && (!this.status
        || (this.status === ServiceInstructionStatus.OPENED.code));
  }

  get isNew() {
    return this
      && (!this.status);
  }

  get isFinished() {
    return this
      && this.id
      && this.status
      && this.status === ServiceInstructionStatus.FINISHED.code;
  }
}
