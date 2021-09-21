import { GenericType } from "../../pack-type/generic-type";

export class DailyEntry {
  static fromListData(listData: Array<DailyEntry>): Array<DailyEntry> {
    return listData.map((data) => {
      return DailyEntry.fromData(data);
    });
  }

  static fromData(data: DailyEntry): DailyEntry {
    if (!data) return new this();
    let batch = new this(
      data.from,
      data.to,
      data.packTypeStorage,
      data.packTypeTransport,
      data.nameCollaborator,
      data.batchCode,
      data.netQuantitySacks,
      data.codePackType,
      data.codeStorageType,
      data.netQuantitySacksBatch
    );
    return batch;
  }

  constructor(
    public from?: number,
    public to?: number,
    public packTypeStorage?: GenericType,
    public packTypeTransport?: GenericType,
    public nameCollaborator?: string,
    public batchCode?: string,
    public netQuantitySacks?: number,
    public codePackType?: string,
    public codeStorageType?: string,
    public netQuantitySacksBatch?: number
  ) { }
  get getPackTypeStorageString(): string {
    if (!this.packTypeStorage) {
      return "";
    }
    return this.packTypeStorage.name;
  }

  get getPackTypeTransportString(): string {
    if (!this.packTypeTransport) {
      return "";
    }
    return this.packTypeTransport.name;
  }
  get getPackTypeTransport(): GenericType {
    return GenericType.fromData(this.packTypeTransport.code);
  }

  get getPackStorageType(): GenericType {
    return GenericType.fromData(this.packTypeStorage.code);
  }
}
