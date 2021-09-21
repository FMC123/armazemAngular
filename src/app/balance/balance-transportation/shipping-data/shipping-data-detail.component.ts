import { Component, OnInit, Input } from '@angular/core';
import {Transportation} from "../../../transportation/transportation";
import {NumberHelper} from "../../../shared/globalization";
import {BalanceTransportationOutService} from "../balance-transportation-out.service";
import {BatchOperationService} from "../../../batch-operation/batch-operation.service";
import {MarkupGroup} from "../../../markup-group/markup-group";
import {BatchOperation} from "../../../batch-operation/batch-operation";
import {ErrorHandler} from "../../../shared/errors/error-handler";

@Component({
  selector: 'app-shipping-data-detail',
  templateUrl: 'shipping-data-detail.component.html'
})
export class ShippingDataDetailComponent implements OnInit {

  @Input() transportation: Transportation;
  public markupGroup: MarkupGroup;

  constructor(
    private batchOperationService: BatchOperationService,
    private errorHandler: ErrorHandler
  ) { }

  ngOnInit() {
    if (this.transportation.batchOperationOut) {
      this.batchOperationService.find(this.transportation.batchOperationOut.id)
        .then((batchOperation: BatchOperation) => {

          if (batchOperation && batchOperation.markupGroup) {
            this.markupGroup = batchOperation.markupGroup;
          }
        })
        .catch((error) => this.errorHandler.fromServer(error));
    }
  }

  get shippingData() {
    return this.transportation.batchOperationOut.shippingData;
  }

  get totalQuantity() {
    if (this.markupGroup)
      return this.markupGroup.getTotalSacks();
    else
      return 0;
  }

  get totalNetWeight() {
    if(this.markupGroup) {
      let total = this.shippingData && this.shippingData.packTypes && this.shippingData.packTypes.length > 0
        ? this.shippingData.packTypes.filter( pt => pt.weightAddition )
          .map( pt => pt.packType && pt.quantity && pt.packType.weight ? pt.quantity * pt.packType.weight : 0)
          .reduce( (w1, w2) => w1 + w2 , 0)
        : 0;
      return NumberHelper.toPTBR(total + NumberHelper.fromPTBR(this.markupGroup.getTotalWeight()));
    } else {
      return NumberHelper.toPTBR(0);
    }
  }

  get totalSackWeight(){
    const shippingData = this.shippingData;

    if(shippingData && shippingData.packTypes && shippingData.packTypes.length > 0){
      let totalWeight = shippingData.packTypes.map(pack=>{
        if(pack.weightAddition){
          return pack.packType && pack.quantity && pack.packType.weight ? pack.quantity * pack.packType.weight : 0
        }
        return 0;
      }).reduce((a,b)=>a+b,0);

      return  NumberHelper.toPTBR(totalWeight);
    }
    return NumberHelper.toPTBR(0);
  }

  get productWeight(){
    let total = NumberHelper.fromPTBR(this.totalNetWeight) - NumberHelper.fromPTBR(this.totalSackWeight);
    return NumberHelper.toPTBR(total);
  }

  get packTypes(){
    let packString: string = "";
    if (this.shippingData && this.shippingData.packTypes){
      let packTypesDesc:Array<string> = [];
      this.shippingData.packTypes.forEach(pt => packTypesDesc.push(pt.packType.description));
      packString = packTypesDesc.join("; ");
    } else if(this.shippingData && this.shippingData.packType)
      packString = packString.concat(this.shippingData.packType.description);

    return packString;
  }


}
