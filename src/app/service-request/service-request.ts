import { DateTimeHelper } from '../shared/globalization';
import { Batch } from '../batch/batch';
import { Collaborator } from '../collaborator/collaborator';
import { User } from '../user/user';
import { ServiceRequestStatus } from './service-request-status';
import { ServiceRequestType } from './service-request-type';
import { ServiceRequestBatch } from './service-request-batch';
import { Warehouse } from 'app/warehouse/warehouse';

export class ServiceRequest {

  static fromListData(listData: Array<ServiceRequest>): Array<ServiceRequest> {
    return listData.map((data) => {
      return ServiceRequest.fromData(data);
    });
  }

  static fromData(data?: ServiceRequest): ServiceRequest {
    if (!data) {
      return new this();
    }

    let serviceRequest = new this(
      data.id,
      data.code,
      data.createdDate,
      data.closedDate,
      data.collaborator,
      data.user,
      data.type,
      data.status,
      data.observation,
      data.batches,
      data.serviceRequestDate,
      data.warehouse,
      data.instructionServiceAxCode,
      data.serviceInstructionId
    );

    return serviceRequest;
  }

  constructor(
    public id?: string,
    public code?: string,
    public createdDate?: number,
    public closedDate?: number,
    public collaborator?: Collaborator,
    public user?: User,
    public type?: string,
    public status?: string,
    public observation?: string,
    public batches?: Array<ServiceRequestBatch>,
    public serviceRequestDate?: number,
    public warehouse?: Warehouse,
    public instructionServiceAxCode?: string,
    public serviceInstructionId?: string
  ) {
    if (collaborator) {
      this.collaborator = Collaborator.fromData(collaborator);
    }
    if (user) {
      this.user = User.fromData(user);
    }
    if (batches) {
      this.batches = ServiceRequestBatch.fromListData(batches);
    }

    if (warehouse) {
      this.warehouse = Warehouse.fromData(warehouse);
    }
  }

  get createdDateString(): string {
    return DateTimeHelper.toDDMMYYYY(this.createdDate);
  }

  set openedDateString(createdDateString: string) {
    this.createdDate = DateTimeHelper.fromDDMMYYYY(createdDateString);
  }

  get closedDateString(): string {
    return DateTimeHelper.toDDMMYYYY(this.closedDate);
  }

  set closedDateString(closedDateString: string) {
    this.closedDate = DateTimeHelper.fromDDMMYYYY(closedDateString);
  }

  get statusObject() {
    return ServiceRequestStatus.fromData(this.status);
  }

  get typeObject() {
    return ServiceRequestType.fromData(this.type);
  }

  /**
   * Lista todos os batches separados por vírgula (cadastrados ou não na base de dados)
   */
  get batchesString() {

    let retorno = '';
    if (this.batches != null && this.batches.length > 0) {
      this.batches.forEach(batches => {

        if (retorno != '') {
          retorno += ', ';
        }

        // pode haver batch não cadastro no armazém
        if (batches.batch != null) {
          retorno += batches.batch.batchCode;
        }
        else {
          retorno += batches.batchCode;
        }
      });
    }

    return retorno;
  }

  /**
   * Lista batches cadastrados, separados por vírgula (com peso e sacas)
   */
  get batchesRegisteredString() {

    let retorno = '';
    if (this.batches != null && this.batches.length > 0) {
      this.batches.forEach(batches => {

        if (batches.batch != null) {

          if (retorno != '') {
            retorno += ', ';
          }  

          retorno += batches.batch.batchCode + ' (' + batches.weight + 'kg / ' + batches.quantity + 'sc)';
        }
      });
    }

    return retorno;
  }

  /**
   * Lista batches NÃO cadastrados, separados por vírgula (com peso e sacas)
   */
  get batchesNotRegisteredString() {

    let retorno = '';
    if (this.batches != null && this.batches.length > 0) {
      this.batches.forEach(batches => {

        if (batches.batchCode != null) {

          if (retorno != '') {
            retorno += ', ';
          }  

          retorno += batches.batchCode + ' (' + batches.weight + 'kg / ' + batches.quantity + 'sc)';
        }
      });
    }

    return retorno;
  }  

  get serviceRequestDateString(): string {
    return DateTimeHelper.toDDMMYYYY(this.serviceRequestDate);
  }
}