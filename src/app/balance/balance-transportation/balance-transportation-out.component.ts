import { Notification } from '../../shared/notification';
import { TransportationStatus } from '../../transportation/transportation-status';
import { TransportationService } from '../../transportation/transportation.service';
import { Transportation } from '../../transportation/transportation';
import { BalanceService } from '../balance.service';
import { ErrorHandler } from '../../shared/errors/error-handler';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BalanceTransportationOutService } from "./balance-transportation-out.service";
import {ProductTransportationType} from "../../transportation/product-transportation-type";
import {ParameterService} from "../../parameter/parameter.service";
import {NumberHelper} from "../../shared/globalization";
import {BatchOperationService} from "../../batch-operation/batch-operation.service";
import {BatchOperation} from "../../batch-operation/batch-operation";
import {MarkupGroupService} from "../../markup-group/markup-group.service";
import {PackStockService} from "../../pack-stock/pack-stock.service";

@Component({
  selector: 'app-balance-transportation-out',
  templateUrl: 'balance-transportation-out.component.html',
  providers: [BalanceTransportationOutService],
})

export class BalanceTransportationOutComponent implements OnInit {

  private weightTolerance = 60;

  constructor(
    private route: ActivatedRoute,
    private balanceTransportationOutService: BalanceTransportationOutService,
    private balanceService: BalanceService,
    private transportationService: TransportationService,
    private router: Router,
    private errorHandler: ErrorHandler,
    private parameterService: ParameterService,
    private packService: PackStockService
  ) { }

  ngOnInit() {
    this.route.data.forEach((data: { transportation: Transportation }) => {
      this.balanceTransportationOutService.transportation = data.transportation;
    });

    this.weightTolerance = this.parameterService.batchOperationWeightTolerance();

    this.loading = true;

    this.balanceService.weighingMode().then(mode => {
      this.balanceTransportationOutService.weighingMode = mode;
      this.loading = false;
    }).catch(error => {
      this.loading = false;
    });
  }

  get transportation() {
    return  this.balanceTransportationOutService.transportation;
  }

  get packing(){
    return  this.balanceTransportationOutService.transportation.productType == ProductTransportationType.PACKING.code;
  }

  get loading() {
    return this.balanceTransportationOutService.loading;
  }

  set loading(value) {
    this.balanceTransportationOutService.loading = !!value;
  }

  get isWeighingModeGeneral() {
    return this.transportation.batchOperationOut.balanceWeightingMode !== 'INDIVIDUAL';
  }

  finishBoarding() {
    this.loading = true;
    return this.transportationService
      .finishBoarding(this.transportation)
      .then(() => {
        this.loading = false;
        Notification.success('Embarque finalizado com sucesso!');
        this.router.navigate(['/balance']);
      }).catch();
  };

  downloadWeightTicket() {
    this.loading = true;
    return this.balanceService.downloadWeightTicketGrouped(this.transportation.id).then(() => {
      this.loading = false;
    }).catch(error => this.handleError(error));
  }

  /**
   * Ticket de peso de saída
   */
  downloadWeightTicketOut() {
    this.loading = true;
    return this.balanceService.downloadWeightTicketGroupedOut(this.transportation.id).then(() => {
      this.loading = false;
    }).catch(error => this.handleError(error));
  }

  /**
   * Ticket de peso de saída
   */
  downloadWeightTicketOutPackagingOnly() {
    this.loading = true;
    return this.balanceService.downloadWeightTicketOutPackagingOnly(this.transportation.id).then(() => {
      this.loading = false;
    }).catch(error => this.handleError(error));
  }

  printInternalOutputControl() {
    this.loading = true;
    let blob: Promise<Blob> = this.balanceService.printInternalOutputControl(this.transportation.id);
    blob.then((b) => {
      if (b.size === 0) {
        Notification.error('Não foi encontrado informações para abrir o relatório!');
      } else {
        let urlReport = window.URL.createObjectURL(b);
        window.open(urlReport);
      }
      this.loading = false;
    });
  }

  handleError(error) {
    this.loading = false;
    return this.errorHandler.fromServer(error);
  }

  allowFinishBoarding() {
    let allow = true;
    let transportation = this.transportation;
    if (!transportation.batchOperationOut.markupGroup){
      return false;
    }

    const shippingData = transportation.batchOperationOut.shippingData||null;

    const packWeight = shippingData && shippingData.packTypes && shippingData.packTypes.length > 0
      ? shippingData.packTypes.filter( pt => pt.weightAddition )
        .map( pt => pt.packType && pt.quantity && pt.packType.weight ? pt.quantity * pt.packType.weight : 0)
        .reduce( (w1, w2) => w1 + w2 , 0)
          : 0;

    let tolerance = (transportation.netWeight) - (packWeight + NumberHelper.fromPTBR(transportation.batchOperationOut.markupGroup.getTotalWeight()));
    if (!(transportation.status && transportation.status === TransportationStatus.PROCESSO_CARGA_DESCARGA.code)) {
      allow = false;
    }

    if (this.packing && (!transportation.tareWeight || transportation.tareWeight <= 0)) {
      allow = false;
    }

    if (!this.packing && (!transportation.batchOperationOut || transportation.batchOperationOut.netWeight <= 0)) {
      allow = false;
    }

    if(!this.packService.hiddenPackingData()){
      if (tolerance < -20) {
        allow = false;
      }
    }else if (!this.parameterService.shipmentLargerThanAuthorization()){
      if (tolerance < -this.weightTolerance
        // || tolerance > this.weightTolerance
      ) {
        allow = false;
      }
    }

    return allow;
  }
}
