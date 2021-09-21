
export class IntegrationZimMove {

  static fromListData(listData: Array<IntegrationZimMove>): Array<IntegrationZimMove> {
    return listData.map((data) => {
      return IntegrationZimMove.fromData(data);
    });
  }

  static fromData(data: IntegrationZimMove): IntegrationZimMove {
    if (!data) {
      return new this();
    }

    let equipament = new this(
      data.id,
      data.company,
      data.processName,
      data.stringJson,
      data.queueName,
      data.lote,
      data.responseDate,
      data.createdDate,
      data.returnDate,
      data.processDate,
      data.stringSecJson,
      data.description,

    );

    return equipament;
  }

  constructor(
    public id?: string,
    public company?: string,
    public processName?: string,
    public stringJson?: string,
    public queueName?: string,
    public lote?: string,
    public responseDate?: number,
    public createdDate?: number,
    public returnDate?: number,
    public processDate?: number,
    public stringSecJson ?: string,
    public description?: string

  ) { }

}
