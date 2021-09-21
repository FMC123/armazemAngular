import { Masks } from '../../../shared/forms/masks/masks';
import { BatchOperationWeight } from '../../../batch-operation/batch-operation-weight';
import { BalanceService } from '../../balance.service';
import { BalanceTransportationInService } from '../balance-transportation-in.service';

import { Component, OnInit } from '@angular/core';
import {ErrorHandler} from '../../../shared/errors/error-handler';
import {Transportation} from "../../../transportation/transportation";
import {BatchOperation} from "../../../batch-operation/batch-operation";

@Component({
  selector: 'app-balance-transportation-batch-operation-weighing-all',
  templateUrl: 'balance-transportation-batch-operation-weighing-all.component.html'
})

export class BalanceTransportationBatchOperationWeighingAllComponent implements OnInit {

  decimalMask = Masks.decimalMask;
  onlyIndividual = true;

  constructor(
    private balanceService: BalanceService,
    private balanceTransportationService: BalanceTransportationInService,
    private errorHandler: ErrorHandler,
  ) { }

  ngOnInit() {
  }

  //TODO: Revisar pesagem GERAL

  allowManualWeighing(batchOperation: BatchOperation) {
    return this.balanceTransportationService.allowManualWeighing;
  }

  get transportation() {
    return this.balanceTransportationService.transportation ? this.balanceTransportationService.transportation : new Transportation();
  }

  weighGross() {
    let batchOperationWeight = new BatchOperationWeight();
    batchOperationWeight.listBatchOperations = this.balanceTransportationService.batchOperations.filter(bo=>bo.balanceWeightingMode !=='INDIVIDUAL');
    batchOperationWeight.scale = this.balanceService.scale;
    batchOperationWeight.type = 'GROSS';

    this.balanceService.saveWeight(batchOperationWeight).then(response => {
      this.transportation.grossWeight = response.weight;
      this.balanceTransportationService.batchOperation = null;
      this.balanceTransportationService.refreshFiscalNotes();
    }).catch(error => this.errorHandler.fromServer(error));
  }

  saveGross() {
    let batchOperationWeight = new BatchOperationWeight();
    batchOperationWeight.listBatchOperations = this.balanceTransportationService.batchOperations.filter(bo=>bo.balanceWeightingMode !=='INDIVIDUAL');
    batchOperationWeight.weight = this.transportation.grossWeight;
    batchOperationWeight.type = 'GROSS';
    batchOperationWeight.manual = true;

    this.balanceService.saveWeight(batchOperationWeight).then(response => {
      this.transportation.grossWeight = response.weight;
      this.balanceTransportationService.batchOperation = null;
      this.balanceTransportationService.refreshFiscalNotes();
    }).catch(error => this.errorHandler.fromServer(error));
  }

  weighTare() {
    let batchOperationWeight = new BatchOperationWeight();
    batchOperationWeight.listBatchOperations = this.balanceTransportationService.batchOperations.filter(bo=>bo.balanceWeightingMode !=='INDIVIDUAL');
    batchOperationWeight.scale = this.balanceService.scale;
    batchOperationWeight.type = 'TARE';

    this.balanceService.saveWeight(batchOperationWeight).then(response => {
      this.transportation.tareWeight = response.weight;
      this.balanceTransportationService.batchOperation = null;
      this.balanceTransportationService.refreshFiscalNotes();
    }).catch(error => this.errorHandler.fromServer(error));
  }

  saveTare() {
    let batchOperationWeight = new BatchOperationWeight();
    batchOperationWeight.listBatchOperations = this.balanceTransportationService.batchOperations.filter(bo=>bo.balanceWeightingMode !=='INDIVIDUAL');
    batchOperationWeight.weight = this.transportation.tareWeight;
    batchOperationWeight.type = 'TARE';
    batchOperationWeight.manual = true;

    this.balanceService.saveWeight(batchOperationWeight).then(response => {
      this.transportation.tareWeight = response.weight;
      this.balanceTransportationService.batchOperation = null;
      this.balanceTransportationService.refreshFiscalNotes();
    }).catch(error => this.errorHandler.fromServer(error));
  }

}
