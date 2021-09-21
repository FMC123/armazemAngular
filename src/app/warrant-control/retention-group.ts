import {NumberHelper} from "../shared/globalization";
import {WarehouseStakeholder} from "../warehouse-stakeholder/warehouse-stakeholder";

export class RetentionGroup {
  static fromListData(listData: Array<any>): Array<RetentionGroup> {
    return listData.map(data => {
      return RetentionGroup.fromData(data);
    });
  }

  static fromData(data: any, options: any = {}): RetentionGroup {
    if (!data) {
      return new this();
    }

    let retentionGroup = new this(
      data.client,
      data.currentStock,
      data.retentionStock,
    );
    return retentionGroup;
  }

  constructor(
    public client?:WarehouseStakeholder,
    public currentStock?:number,
    public retentionStock?:number,
  ) {

    if(client){
      this.client = WarehouseStakeholder.fromData(this.client);
    }

  }

  get currentStockString(){
    return NumberHelper.toPTBR(this.currentStock)  + ' kg';
  }

  get retentionStockString(){
    return NumberHelper.toPTBR(this.retentionStock) + ' kg';
  }

  get balance(){
    const currentStockAux = this.currentStock || 0;
    const retentionStockAux = this.retentionStock || 0
    return currentStockAux - retentionStockAux;
  }

  get balanceString(){
    return NumberHelper.toPTBR(this.balance) + ' kg';
  }

  get balancePercentString(){
    return this.currentStock? (this.balance*100/this.currentStock).toFixed(2) + '%':'0.00%'
  }

}
