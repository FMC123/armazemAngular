export class UnavailableBatchWeight {

  static fromListData(listData: Array<UnavailableBatchWeight>): Array<UnavailableBatchWeight> {
    return listData.map((data) => {
      return UnavailableBatchWeight.fromData(data);
    });
  }

  static fromData(data: UnavailableBatchWeight): UnavailableBatchWeight {
    return new UnavailableBatchWeight(
      data.batchId,
      data.unavailableWeight,
    );
  }

  constructor(
    public batchId: string,
    public unavailableWeight: number,
  ) {}

}
