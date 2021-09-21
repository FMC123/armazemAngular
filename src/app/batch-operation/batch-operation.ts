import { Collaborator } from '../collaborator/collaborator';
import { MarkupGroup } from '../markup-group/markup-group';
import { OperationType } from '../operation-type/operation-type';
import { BatchOperationType } from './batch-operation-type';
import { BatchOperationStatus } from './batch-operation-status';
import { WarehouseStakeholder } from '../warehouse-stakeholder/warehouse-stakeholder';
import { FiscalNote } from '../fiscal-note/fiscal-note';
import { DateTimeHelper } from '../shared/globalization';
import { NumberHelper } from '../shared/globalization';
import { User } from '../user/user';
import { ShippingAuthorization } from '../shipping-authorization/shipping-authorization';
import { Certificate } from '../certificate/certificate';
import { Batch } from '../batch/batch';
import { Warehouse } from "../warehouse/warehouse";
import { ServiceInstruction } from "../service-instruction/service-instruction";
import { ShippingData } from 'app/shipping-data/shipping-data';

export class BatchOperation {
  static fromListData(listData: Array<BatchOperation>): Array<BatchOperation> {
    return listData.map(data => {
      return BatchOperation.fromData(data);
    });
  }

  static fromData(data: BatchOperation): BatchOperation {
    if (!data) return new this();
    let batchOperation = new this(
      data.id,
      data.warehouse,
      data.operationType,
      data.batchOperationCode,
      data.auditor,
      data.sacksQuantity,
      data.sacksQuantityTyped,
      data.grossWeight,
      data.tara,
      data.netWeight,
      data.createdDate,
      data.owner,
      data.status,
      data.type,
      data.note,
      data.sellCode,
      data.shippingAuthorization,
      data.markupGroup,
      data.collaborator,
      data.serviceInstruction,
      data.fiscalNoteOrSellCode,
      data.certificates,
      data.batches,
      data.storedWeight,
      data.showOnMobileDevices,
      data.errorMessageIntegrationProcafe,
      data.shippingData,
      data.balanceWeightingMode,
      data.officialDate,
      data.fiscalNotes,
      data.taskOrder
    );
    return batchOperation;
  }

  constructor(
    public id?: string,
    public warehouse?: Warehouse,
    public operationType?: OperationType,
    public batchOperationCode?: string,
    public auditor?: User,
    public sacksQuantity?: number,
    public sacksQuantityTyped?: boolean,
    public grossWeight?: number,
    public tara?: number,
    public netWeight?: number,
    public createdDate?: number,
    public owner?: WarehouseStakeholder,
    public status?: string,
    public type?: string,
    public note?: string,
    public sellCode?: string,
    public shippingAuthorization?: ShippingAuthorization,
    public markupGroup?: MarkupGroup,
    public collaborator?: Collaborator,
    public serviceInstruction?: ServiceInstruction,
    public fiscalNoteOrSellCode?: string,
    public certificates?: Array<Certificate>,
    public batches?: Batch[],
    public storedWeight?: number,
    public showOnMobileDevices?: boolean,
    public errorMessageIntegrationProcafe?: string,
    public shippingData?: ShippingData,
    public balanceWeightingMode?: string,
    public officialDate?: number,
    public fiscalNotes?: Array<FiscalNote>,
    public taskOrder?: number
  ) {

    if (warehouse) {
      this.warehouse = Warehouse.fromData(warehouse);
    }

    if (auditor) {
      this.auditor = User.fromData(auditor);
    }

    if (certificates) {
      this.certificates = Certificate.fromListData(certificates);
    } else {
      this.certificates = [];
    }

    if (operationType) {
      this.operationType = OperationType.fromData(operationType);
    }

    if (shippingAuthorization) {
      this.shippingAuthorization = ShippingAuthorization.fromData(
        shippingAuthorization
      );
    }

    if (markupGroup) {
      this.markupGroup = MarkupGroup.fromData(markupGroup);
    }

    if (collaborator) {
      this.collaborator = Collaborator.fromData(collaborator);
    }

    if (owner) {
      this.owner = WarehouseStakeholder.fromData(owner);
      if (collaborator) {
        this.owner.collaboratorRegistration = collaborator.registration
      }
    }

    if (serviceInstruction) {
      this.serviceInstruction = ServiceInstruction.fromData(serviceInstruction);
    }

    if (batches) {
      this.batches = Batch.fromListData(batches);
    }

    if (shippingData) {
      this.shippingData = ShippingData.fromData(shippingData);
    }

    if (this.type === 'P_OUT') {
      this.netWeightString =  this.markupGroup.getTotalWeight();
      this.storedWeightString = this.markupGroup.getCurrentWeight();
    }

    if(fiscalNotes){
      this.fiscalNotes = FiscalNote.fromListData(fiscalNotes);
    }

    this.sacksQuantity = sacksQuantity || 0;
  }

  get needInitiateInput() {
    return (
      this.status === BatchOperationStatus.RESERVED.code &&
      (this.grossWeight && this.grossWeight > 0)
    );
  }

  get needFinalizeInput() {
    return (
      (this.status === BatchOperationStatus.OPEN.code ||
        this.status === BatchOperationStatus.INITIED.code) &&
      (this.tara && this.tara > 0)
    );
  }

  get allowView() {
    return (
      this.status !== BatchOperationStatus.OPEN.code &&
      this.status !== BatchOperationStatus.INITIED.code &&
      this.type !== BatchOperationType.OT_IN.code &&
      this.type !== BatchOperationType.OT_OUT.code
    );
  }

  get allowEdit() {
    return (
      this.status === BatchOperationStatus.OPEN.code ||
      this.status === BatchOperationStatus.RESERVED.code ||
      this.status === BatchOperationStatus.AUDITING.code ||
      this.status === BatchOperationStatus.INITIED.code ||
      this.status === BatchOperationStatus.DUMPED.code
      //|| this.status === BatchOperationStatus.STORED.code
    );
  }

  get allowEditMobile() {
    return (
      this.status === BatchOperationStatus.OPEN.code ||
      this.status === BatchOperationStatus.RESERVED.code ||
      this.status === BatchOperationStatus.AUDITING.code ||
      this.status === BatchOperationStatus.INITIED.code ||
      this.status === BatchOperationStatus.DUMPED.code ||
      this.status === BatchOperationStatus.STORED.code
    );
  }

  get isStored(){
    return this.status === BatchOperationStatus.STORED.code;
  }

  get allowDelete() {
    return (
      this.status === BatchOperationStatus.OPEN.code ||
      this.status === BatchOperationStatus.INITIED.code ||
      this.status === BatchOperationStatus.DUMPED.code ||
      this.status === BatchOperationStatus.RESERVED.code
    );
  }

  get statusObject(): BatchOperationStatus {
    return BatchOperationStatus.fromData(this.status);
  }

  set statusObject(value: BatchOperationStatus) {
    if (value) {
      this.status = value.code;
    } else {
      this.status = null;
    }
  }

  get typeObject(): BatchOperationType {
    return BatchOperationType.fromData(this.type);
  }

  set typeObject(value: BatchOperationType) {
    if (value) {
      this.type = value.code;
    } else {
      this.type = null;
    }
  }

  get sacksQuantityString() {
    if (!this.tara) {
      return '-';
    }

    if (!this.grossWeight) {
      return '-';
    }
    //return NumberHelper.toPTBR(this.sacksQuantity);
    return String(this.sacksQuantity);
  }

  set sacksQuantityString(value) {
    //this.sacksQuantity = NumberHelper.fromPTBR(value);
    this.sacksQuantity = Number(value);
  }

  get grossWeightString(): string {
    return NumberHelper.toPTBR(this.grossWeight);
  }

  set grossWeightString(value) {
    this.grossWeight = NumberHelper.fromPTBR(value);
  }

  get taraString(): string {
    return NumberHelper.toPTBR(this.tara);
  }

  set taraString(value) {
    this.tara = NumberHelper.fromPTBR(value);
  }

  get netWeightString(): string {
    if(this.type === 'W_OUT'){
      /*return this.markupGroup.getTotalWeight();*/
      if (!this.tara) {
        return '-';
      }
    }

    if (!this.grossWeight) {
      return '-';
    }

    if (this.type !== 'P_OUT' && this.type !== 'P_IN') {
      if (!this.tara) {
        return '-';
      }
    }

    return NumberHelper.toPTBR(this.netWeight);
  }

  set netWeightString(value) {
    this.netWeight = NumberHelper.fromPTBR(value);
  }

  get createdDateString(): string {
    return DateTimeHelper.toDDMMYYYYHHmm(this.createdDate);
  }

  set createdDateString(createdDateString: string) {
    this.createdDate = DateTimeHelper.fromDDMMYYYYHHmm(createdDateString);
  }

  get storedWeightString(): string {
    if(this.type === 'W_OUT'){
      return this.markupGroup.getCurrentWeight();
    }

    if (this.type !== 'P_OUT' && this.type !== 'P_IN') {
      if (!this.storedWeight) {
        return '-';
      }
    }

    return NumberHelper.toPTBR(this.storedWeight);
  }

  set storedWeightString(value) {
    this.storedWeight = NumberHelper.fromPTBR(value);
  }

  /**
   * Nomes dos certificados, separados por vírgula
   */
  get certificateNames() {

    let listNames = [];
    if (this.certificates == null || this.certificates.length < 1) {
      return '';
    }

    this.certificates.forEach(c => {
      listNames.push(c.name);
    });

    return listNames.join(', ');
  }

  get allowCancel() {
    let batchAux:Batch = null;
    for (const batch of this.batches) {
      if(batch.batchReference)
      {
        batchAux = batch;
      }
    }

    return (
      this.status === BatchOperationStatus.CLOSED.code &&
      batchAux && batchAux.batchReference
    );
  }

  get refClient(){
    switch (this.type) {
      case 'W_IN':
        return this.fiscalNotes && this.fiscalNotes.length > 0 ? this.fiscalNotes
          .map( fn => fn.purchaseOrder && fn.purchaseOrder.purchaseOrderCode || '' )
          .filter( ref => ref && ref.length > 0 )
          .join(', ') || '-' : '-';
      case 'P_IN':
      case 'P_OUT':
        return (this.serviceInstruction && this.serviceInstruction.clientReferenceCode) || '-' ;
      default:
        return (this.batches && this.batches[0] && this.batches[0].refClient) || '-';
    }
  }

}
