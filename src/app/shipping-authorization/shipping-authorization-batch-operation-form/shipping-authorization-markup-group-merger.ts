import { MarkupGroupStorageUnit } from '../../markup-group/storage-unit/markup-group-storage-unit';
import { MarkupGroupBatch } from '../../markup-group/batch/markup-group-batch';
import { Batch } from '../../batch/batch';
import { MarkupGroup } from '../../markup-group/markup-group';
import {ShippingAuthorization} from "../shipping-authorization";
import {Transportation} from "../../transportation/transportation";
import {MarkupGroupType} from "../../markup-group/markup-group-type";


export class ShippingAuthorizationMarkupGroupMerger {

  constructor(
    private mgbNotLimitedParam: boolean
  ) {}

  /*static merge(
    from: MarkupGroup,
    to: MarkupGroup,
    shippingAuthorizationBatches: Array<Batch>,
    shippingAuthorization:ShippingAuthorization,
    transportationSelected: Transportation,
    transportations: Array<Transportation>) {

    return merge(from, to, shippingAuthorizationBatches, shippingAuthorization, transportationSelected, transportations);
  }*/

  public merge(
    from: MarkupGroup,
    to: MarkupGroup,
    shippingAuthorizationBatches: Array<Batch>,
    shippingAuthorization:ShippingAuthorization,
    transportationSelected: Transportation,
    transportations: Array<Transportation>
  ) {
    const mergeBatch = (batch: MarkupGroupBatch) => {
      const existsAtShippingAuthorization = shippingAuthorizationBatches.some(l => l.id === batch.batch.id);

      if (!existsAtShippingAuthorization) {
        return;
      }

      const existsAtTo = to.batches.some(b => b.batch.id === batch.batch.id);

      if (existsAtTo && to.type === MarkupGroupType.SHIPPING_AUTHORIZATION.code) {
        to.batches
          .find(b => b.batch.id === batch.batch.id)
          .quantity += batch.batch.availableSacks;
        return;
      }

      to.batches.push(new MarkupGroupBatch(null, null, batch.quantity, null, null, batch.batch, null, null, batch, null));
    };

    const mergeStorageUnit = (storageUnit: MarkupGroupStorageUnit) => {
      const existsStorageUnitBatchAtTo = to.storageUnits.some((tsu) => {
        return tsu.storageUnitBatch.storageUnit.id === storageUnit.storageUnitBatch.storageUnit.id
          && tsu.storageUnitBatch.batch.id === storageUnit.storageUnitBatch.batch.id;
      });

      if (existsStorageUnitBatchAtTo) {
        return;
      }

      const existsAtShippingAuthorization = shippingAuthorizationBatches.some(l => l.id === storageUnit.storageUnitBatch.batch.id);

      if (!existsAtShippingAuthorization) {
        return;
      }

      const existsBatchAtTo = to.batches.some(b => b.batch.id === storageUnit.storageUnitBatch.batch.id);

      if (existsBatchAtTo) {
        to.batches
          .find(b => b.batch.id === storageUnit.storageUnitBatch.batch.id)
          .quantity += storageUnit.storageUnitBatch.quantity;
      } else {
        to.batches.push(new MarkupGroupBatch(null, null, storageUnit.storageUnitBatch.quantity, null, null, storageUnit.storageUnitBatch.batch, null));
      }

      to.storageUnits.push(new MarkupGroupStorageUnit(null, storageUnit.storageUnitBatch, null, storageUnit.storageUnitBatch.quantity));
    };

    const trimToWeightLimit = () => {
      let storageUnitsToKeep = [];

      to.batches.forEach((batch) => {
        const shippingAuthorizationBatch = shippingAuthorizationBatches.find(b => b.id === batch.batch.id);
        var leftQuantity:number;
        if(!this.mgbNotLimitedParam)
          leftQuantity = this.getShippingAuthorizationLeftQuantity(batch.batch, shippingAuthorization, transportationSelected, transportations);
        else
          leftQuantity = this.getMkupBatchLeftQuantity(batch.batch, shippingAuthorization, transportationSelected, transportations);

        if (batch.quantity > leftQuantity) {
          batch.quantity = leftQuantity;
        }

        let sumOfStorageUnitQuantities = 0;

        to.storageUnits.forEach((storageUnit) => {
          const limitReached = sumOfStorageUnitQuantities >= leftQuantity;

          if (limitReached) {
            return;
          }

          sumOfStorageUnitQuantities += storageUnit.quantity;
          storageUnitsToKeep.push(storageUnit);
        });

        storageUnitsToKeep = storageUnitsToKeep.filter((item, index) => {
          return index === storageUnitsToKeep.findIndex(i => i.storageUnitBatch.id === item.storageUnitBatch.id);
        });

        to.storageUnits = storageUnitsToKeep;
      });
    };

    from.batches.forEach(mergeBatch);
    from.storageUnits.forEach(mergeStorageUnit);
    trimToWeightLimit();
  }

  private getShippingAuthorizationLeftQuantity(
    batch:Batch,
    shippingAuthorization:ShippingAuthorization,
    transportationSelected: Transportation,
    transportations: Array<Transportation>
  ): number{
    let mgb:MarkupGroupBatch = shippingAuthorization.batches.find(b => b.batch.id === batch.id)
    let mgBatchOtherExecutedQuantity: number = 0;

    //Busca as quantidades já selecionadas em cada transportation
    for(var indexTransp in transportations) {
      let transportation: Transportation = transportations[indexTransp];
      if(transportationSelected.id != transportation.id){
        let batchesOpOut:Array<MarkupGroupBatch> = transportation.batchOperationOut.shippingAuthorization.markupGroup.batches
        for(var indexMarkBatch in batchesOpOut){
          let markupGroupBatch: MarkupGroupBatch = batchesOpOut[indexMarkBatch];
          if(markupGroupBatch.batch.id == batch.id && markupGroupBatch.id != mgb.id)
          {
            mgBatchOtherExecutedQuantity =  mgBatchOtherExecutedQuantity + markupGroupBatch.currentQuantity;
          }
        }
      }
    }

    return mgb.leftQuantity - mgBatchOtherExecutedQuantity;
  }

  private getMkupBatchLeftQuantity(
    batch:Batch, shippingAuthorization:ShippingAuthorization,
    transportationSelected: Transportation,
    transportations: Array<Transportation>
  ): number{
    let mgb:MarkupGroupBatch = shippingAuthorization.batches.find(b => b.batch.id === batch.id)
    let mgBatchTotalLeftQuantity: number = 0;

    //Busca as quantidades já selecionadas em cada transportation
    for(var indexTransp in transportations) {
      let transportation: Transportation = transportations[indexTransp];
      if(transportationSelected.id != transportation.id){
        let batchesOpOut:Array<MarkupGroupBatch> = transportation.batchOperationOut.markupGroup.batches
        for(var indexMarkBatch in batchesOpOut){
          let markupGroupBatch: MarkupGroupBatch = batchesOpOut[indexMarkBatch];
          if(markupGroupBatch.batch.id == batch.id)
          {
            // FIX quantidade de sacas seja apresentada seja exatamente igual a quantidade de sacas associada.
            // mgBatchTotalLeftQuantity =  mgBatchTotalLeftQuantity + markupGroupBatch.leftQuantity;
          }
        }
      }
    }

    return mgb.leftQuantity - mgBatchTotalLeftQuantity;
  }


}





