export class StatusWarehouseStakeholder {

  static ACTIVE = StatusWarehouseStakeholder.fromData('ACTIVE');
  static INACTIVE = StatusWarehouseStakeholder.fromData('INACTIVE');

  static fromListData(listData: Array<string>): Array<StatusWarehouseStakeholder> {
    return listData.map((data) => {
      return StatusWarehouseStakeholder.fromData(data);
    });
  }

  static fromData(data: string): StatusWarehouseStakeholder {
    if (!data) return new this();
    let type = new this(data);
    return type;
  }

  static fromDataObject(data: StatusWarehouseStakeholder): StatusWarehouseStakeholder {
    if (!data) return new this();
    let city = new this();
    return city;
  }

  constructor(public code?: string) {}

  get name(){
    switch (this.code) {
      case 'ACTIVE':
        return 'Ativo';
      case 'INACTIVE':
        return 'Inativo';
      default:
        return null;
    }
  }

}
