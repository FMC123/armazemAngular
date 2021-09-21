export class RouteItemStatus {

  static INACTIVE = RouteItemStatus.fromData("inativa");
  static RECEIVING = RouteItemStatus.fromData("recebendo");//status silos e moega
  static BAGGING = RouteItemStatus.fromData("embegando");//status silos e embegadora
  static TRANSFERRING = RouteItemStatus.fromData("transferindo");//status silos
  static DUMPING = RouteItemStatus.fromData("despejando");//status moega para granel
  static FINALIZING = RouteItemStatus.fromData("finalizando");


  static list(): Array<RouteItemStatus> {
    return [
      this.INACTIVE,
      this.RECEIVING,
      this.BAGGING,
      this.TRANSFERRING,
      this.DUMPING,
      this.FINALIZING,
    ];
  }

  static fromListData(listData: Array<string>): Array<RouteItemStatus> {
    return listData.map((data) => {
      return RouteItemStatus.fromData(data);
    });
  }

  static fromData(data: string): RouteItemStatus {
    if (!data) return new this();
    let status = new this(data);
    return status;
  }

  static fromDataObject(data: RouteItemStatus): RouteItemStatus {
    if (!data) return new this();
    let routeData = new this();
    return routeData;
  }

  constructor(public code?: string) { }

}


