import { MarkupGroup } from '../markup-group/markup-group';
import { DateTimeHelper } from '../shared/globalization';
import { User } from './../user/user';

export class AllocationTruck {

  static fromListData(listData: Array<AllocationTruck>): Array<AllocationTruck>{
    return listData.map((data) => {
      return AllocationTruck.fromData(data);
    });
  }

  static fromData(data: AllocationTruck): AllocationTruck {
    if (!data) return new this();
    let allocationTruck = new this(
      data.id,
      data.markupGroupId,
      data.batchCode,
      data.sackes,
      data.batchQuantity,
      data.strainer,
      data.position,
      data.lastModfielBy,
      data.lastModfielDate,
      data.createdBy,
      data.createdDate,
      data.deletedBy,
      data.deletedDate,
    );
    return allocationTruck;
  }

  constructor(
    public id?: string,
    public markupGroupId?: MarkupGroup,
    public batchCode?: string,
    public sackes?: number,
    public batchQuantity?: number,
    public strainer?: string,
    public position?: number,
    public createdBy?: User,
    public createdDate?: User,
    public lastModfielBy?: User,
    public lastModfielDate?: User,
    public deletedBy?: User,
    public deletedDate?: User,

  ) {
    if (createdBy) {
      this.createdBy = User.fromData(createdBy);
    }
  }
}
