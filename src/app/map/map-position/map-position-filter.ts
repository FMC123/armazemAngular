import {NumberHelper} from "../../shared/globalization";

export class MapPositionFilter {

  static fromListData(listData: Array<MapPositionFilter>): Array<MapPositionFilter> {
    return listData.map((data) => {
      return MapPositionFilter.fromData(data);
    });
  }

  static fromData(data: MapPositionFilter): MapPositionFilter {
    if (!data) return new this();
    let mapFilter = new this(
      data.clientName,
      data.batchOperationCode,
      data.batchCode,
      data.qualifiers,
      data.tagCode,
      data.fullPosition,
      data.markupGroupId,
      data.contaminant,
      data.coffeeType,
      data.certificateId,
      data.refClient,
      data.itemType,
      data.itemValueString,
      data.itemValueIntervalMin,
      data.itemValueIntervalMax,
      data.itemValueEnum,
    );
    return mapFilter;
  }

  constructor(public clientName?: string,
              public batchOperationCode?: string,
              public batchCode?: string,
              public qualifiers?: string,
              public tagCode?: string,
              public fullPosition?: string,
              public markupGroupId?: string,
              public contaminant?: boolean,
              public coffeeType?: boolean,
              public certificateId?: string,
              public refClient?: string,
              public itemType?: string,
              public itemValueString?: string,
              public itemValueIntervalMin?: string,
              public itemValueIntervalMax?: string,
              public itemValueEnum?: string,
            ) {
  }

  get isEmpty(): boolean{
    return !Object.keys(this).some((key) => !!this[key]);
  }

  get itemValueIntervalMinNumber(){
    return NumberHelper.fromPTBR(this.itemValueIntervalMin);
  }

  get itemValueIntervalMaxNumber(){
    return NumberHelper.fromPTBR(this.itemValueIntervalMax);
  }

}
