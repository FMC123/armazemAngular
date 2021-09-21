import { Batch }     from "../../batch/batch";
import { Warehouse } from "../../warehouse/warehouse";
import { WarehouseStakeholder } from '../../warehouse-stakeholder/warehouse-stakeholder';

export class BatchOperationMovement {

    static fromData(): BatchOperationMovement {
        return new this();
    }

    constructor(
      public warehouse?: Warehouse,
      public batchOrigin?: Batch,
      public batchDestiny?: String,
      public recipientStakeholder?: WarehouseStakeholder,
      public quantityTransfer?: String,
      public quantityBags?:String,
      public surplusTransfer?:Boolean
      
    ) { }
  }
