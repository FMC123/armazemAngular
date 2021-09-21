import { ServiceItem } from '../service-item/service-item';
import { OperationTypeType } from './operation-type-type';

export class OperationType {

  static fromListData(listData: Array<OperationType>): Array<OperationType> {
    return listData.map((data) => {
      return OperationType.fromData(data);
    });
  }

  static fromData(data?: OperationType): OperationType {
    if (!data) {
      return new this();
    }

    let operationType = new this(
      data.id,
      data.description,
      data.descriptionCounterpart,
      data.type,
      data.isInputDefaultValue,
      data.isOutputDefaultValue,
      data.serviceItemsInputs,
    );

    return operationType;
  }

  constructor(
    public id?: string,
    public description?: string,
    public descriptionCounterpart?: string,
    public type?: string,
    public isInputDefaultValue?: boolean,
    public isOutputDefaultValue?: boolean,
    public serviceItemsInputs?: Array<ServiceItem>,
  ) {

    if (serviceItemsInputs) {
      this.serviceItemsInputs = ServiceItem.fromListData(serviceItemsInputs);
    } else {
      this.serviceItemsInputs = [];
    }
  }

  get typeObject() {
    return OperationTypeType.fromData(this.type);
  }
}
