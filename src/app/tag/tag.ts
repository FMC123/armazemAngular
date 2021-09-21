import { Warehouse } from "../warehouse/warehouse";

export class Tag {

  static fromListData(listData: Array<Tag>): Array<Tag> {
    return listData.map((data) => {
      return Tag.fromData(data);
    });
  }

  static fromData(data: Tag): Tag {
    if (!data) return new this();
    let tag = new this(
      data.id,
      data.tagCode,
      data.warehouse
    );
    return tag;
  }

  constructor(public id?: string,
              public tagCode?: number,
              public warehouse?: Warehouse) {}

}
