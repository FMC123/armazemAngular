import { Transportation } from '../../transportation/transportation';
import { BalanceService } from '../balance.service';
import { BalanceTransportationInService } from './balance-transportation-in.service';

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TransportationStatus } from "../../transportation/transportation-status";
import { ErrorHandler } from "../../shared/errors/error-handler";
import { Notification } from "../../shared/notification";
import {ProductTransportationType} from "../../transportation/product-transportation-type";
import {ParameterService} from "../../parameter/parameter.service";

@Component({
  selector: 'app-balance-transportation-in',
  templateUrl: 'balance-transportation-in.component.html',
  providers: [BalanceTransportationInService],
})

export class BalanceTransportationInComponent implements OnInit {

  packing = false;

  get transportation() {
    let transportation = this.balanceTransportationInService.transportation;
    this.packing = transportation.productType == ProductTransportationType.PACKING.code;
    return transportation;
  }

  constructor(
    private route: ActivatedRoute,
    private balanceTransportationInService: BalanceTransportationInService,
    private balanceService: BalanceService,
    private errorHandler: ErrorHandler,
    private parameterService: ParameterService
  ) { }

  ngOnInit() {
    this.route.data.forEach((data: { transportation: Transportation }) => {
      this.balanceTransportationInService.transportation = data.transportation;
    });

    this.balanceTransportationInService.weighingMode=this.parameterService.balanceWeightingMode();
  }

  get allowInitiate() {
    return this.transportation.statusObject.code === TransportationStatus.AGUARDANDO_ENTRADA.code;
  }

  get allowFinish() {
    let allow = true;
    this.balanceTransportationInService.batchOperations.forEach(batchOperation => {
      if (!batchOperation.tara || batchOperation.tara <= 0)
        allow = false;
    });

    if(this.packing && (  !this.balanceTransportationInService.transportation.tareWeight
                        || this.balanceTransportationInService.transportation.tareWeight <= 0))
    {
      allow = false;
    }

    return allow;
  }

  get weighingMode() {
    for(let bo of this.balanceTransportationInService.batchOperations){

      if(bo.balanceWeightingMode!=='INDIVIDUAL'){
        return 'GERAL';
      }
    }
    if (!this.balanceTransportationInService.batchOperations.length){
      return this.parameterService.balanceWeightingMode();

    }

    return 'INDIVIDUAL';
  }

  get batchOperation() {
    return this.balanceTransportationInService.batchOperation;
  }

  get batchOperations() {
    return this.balanceTransportationInService.batchOperations;
  }

  get loading() {
    return this.balanceTransportationInService.loading;
  }

  set loading(value) {
    this.balanceTransportationInService.loading = !!value;
  }

  save() {
    if(!this.packing)
    {
      this.balanceTransportationInService.save();
    }
    else
    {
      this.balanceTransportationInService.saveFromTransportation();
    }
  }

  downloadWeightTicket() {
    this.loading = true;
    return this.balanceService.downloadWeightTicketGrouped(this.transportation.id).then(() => {
      this.loading = false;
    }).catch(error => {
      this.errorHandler.fromServer(error);
      console.error(error);
      this.loading = false;
    })
  }

  downloadWeightTicketPackagingOnly() {
    this.loading = true;
    return this.balanceService.downloadWeightTicketPackagingOnly(this.transportation.id).then(() => {
      this.loading = false;
    }).catch(error => {
      this.errorHandler.fromServer(error);
      console.error(error);
      this.loading = false;
    })
  }

  downloadInputFormTicket(event: Event, ) {
    event.stopPropagation();
    this.loading = true;

    this.balanceTransportationInService.batchOperations.forEach(batchOperation => {
      if (batchOperation.id) {
        return this.balanceService.downloadInputFormTicket(batchOperation.id).then(() => {
          this.loading = false;
        }).catch(error => {
          Notification.error('Não foi possível gerar o relatótio.');
          this.loading = false;
        });
      }
    });
  }
}
