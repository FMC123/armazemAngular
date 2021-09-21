export class DuctClean {
  static fromListData(listData: Array<DuctClean>): Array<DuctClean> {
    return listData.map((data) => {
      return DuctClean.fromData(data);
    });
  }

  static fromData(data: DuctClean): DuctClean {
    if (!data) return new this();
    let batch = new this(
      data.from,
      data.to,
      data.batchCode,
    );
    return batch;
  }

  constructor(
    public from?: number,
    public to?: number,
    public batchCode?: string,
    ) {}
  }
