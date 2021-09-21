import { DateTimeHelper, NumberHelper } from '../../../shared/globalization';
import { WarehouseStakeholder } from "../../../warehouse-stakeholder/warehouse-stakeholder";

export class IndustrializationFiscalNote {

    static fromListData(
      listData: Array<IndustrializationFiscalNote>
    ): Array<IndustrializationFiscalNote> {
      return listData.map(data => {
        return IndustrializationFiscalNote.fromData(data);
      });
    }
  
    static fromData(data?: IndustrializationFiscalNote): IndustrializationFiscalNote {
      if (!data) {
        return new this();
      }
  
      let IndustrializationFiscalNote = new this(
        data.id,
        data.code,
        data.emissionDate,
        data.clientStakeholder,
        data.totalPrice,
      );
      return IndustrializationFiscalNote;
    }
  
    constructor(
      public id?: string,
      public code?: string,
      public emissionDate?: number,
      public clientStakeholder?: WarehouseStakeholder,
      public totalPrice?: number,
    ) {
    }
  
    get emissionDateString(): string {
      return DateTimeHelper.toDDMMYYYY(this.emissionDate);
    }
  
    set emissionDateString(emissionDateString: string) {
      this.emissionDate = DateTimeHelper.fromDDMMYYYY(emissionDateString);
    }
  
  }