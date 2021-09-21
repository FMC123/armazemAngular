export class MapZonePositionFilter {

  static fromListData(listData: Array<MapZonePositionFilter>): Array<MapZonePositionFilter> {
    return listData.map((data) => {
      return MapZonePositionFilter.fromData(data);
    });
  }

  static fromData(data: MapZonePositionFilter): MapZonePositionFilter {
    if (!data) return new this();
    let mapFilter = new this(
      data.associateName,
      data.batchOperationCode,
      data.batchCode,
      data.qualifiers,
      data.tagCode,
      data.fullPosition
    );
    return mapFilter;
  }

  constructor(public associateName?: string,
              public batchOperationCode?: string,
              public batchCode?: string,
              public qualifiers?: string,
              public tagCode?: string,
              public fullPosition?: string
              ) {
  }

  get isEmpty(): boolean{
    return !Object.keys(this).some((key) => !!this[key]);
  }

}
