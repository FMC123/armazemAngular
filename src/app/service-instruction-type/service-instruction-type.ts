import { NumberHelper } from '../shared/globalization';
import { ServiceInstructionTypePurpose } from '../service-instruction-type/service-instruction-type-purpose';


export class ServiceInstructionType {

  static fromListData(listData: Array<ServiceInstructionType>): Array<ServiceInstructionType> {
    return listData.map((data) => {
      return ServiceInstructionType.fromData(data);
    });
  }

  static fromData(data?: ServiceInstructionType): ServiceInstructionType {
    if (!data) {
      return new this();
    }

    let serviceInstructionType = new this(
      data.id,
      data.code,
      data.name,
      data.purpose,
    );

    return serviceInstructionType;
  }

  constructor(
    public id?: string,
    public code?: string,
    public name?: string,
    public purpose?: string,
  ) {
  }

  get purposeObject() {
    return ServiceInstructionTypePurpose.fromData(this.purpose);
  }
}
