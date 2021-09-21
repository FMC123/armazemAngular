import { NumberHelper } from '../../shared/globalization';
import { BatchReportService } from '../batch-report.service';
import { StorageUnitService } from '../../storage-unit/storage-unit.service';
import { errorHandler } from '@angular/platform-browser/src/browser';
import { StorageUnit } from '../../storage-unit/storage-unit';
import { ErrorHandler } from '../../shared/errors/error-handler';
import { Logger } from '../../shared/logger/logger';
import { Notification } from '../../shared/notification';
import { Page } from '../../shared/page/page';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { KilosSacksConverterService } from "../../shared/kilos-sacks-converter/kilos-sacks-converter.service";
import { MarkupGroupBatch } from "../../markup-group/batch/markup-group-batch";
import { BatchOperationService } from "../../batch-operation/batch-operation.service";
import { URLSearchParams } from "@angular/http";
import { Endpoints } from "../../endpoints";
import { Batch } from "../../batch/batch";
import { AuthService } from "../../auth/auth.service";
import { MarkupGroupService } from "../../markup-group/markup-group.service";
import { MarkupGroupType } from "../../markup-group/markup-group-type";
import { SampleService } from "../../sample/sample.service";
import { Sample } from "../../sample/sample";
import { SampleStatus } from "../../sample/sample-status";
import {BatchService} from "../../batch/batch.service";

@Component({
  selector: 'app-batch-report-stock',
  templateUrl: 'batch-report-stock.component.html'
})

export class BatchReportStockComponent implements OnInit {
  @Input() batch: Batch;
  loading: boolean;
  loadingReserved: boolean;
  openReserved: boolean = false;

  reservedShippingAuthorization: number = 0;
  reservedServiceInstruction: number = 0;
  codesShippingAuthorization: Array<string>;
  codesServiceInstruction: Array<string>;


  storageUnits: Array<StorageUnit>;
  markupGroupBatch: Array<MarkupGroupBatch>;
  saQuantityReserved: number = 0;
  siQuantityReserved: number = 0;
  sample: Sample;
  sHasQuantityReserved: boolean = false;


  constructor(
    private componentService: BatchReportService,
    private serverService: StorageUnitService,
    private kilosSacksConverterService: KilosSacksConverterService,
    private batchOperationService: BatchOperationService,
    private markupGroupService: MarkupGroupService,
    private sampleService: SampleService,
    private auth: AuthService,
    private errorHandler: ErrorHandler,
    private logger: Logger,
    private batchService: BatchService
  ) {
  }

  ngOnInit() {
    Notification.clearErrors();
    this.loadList();
  }

  loadList() {
    this.loading = true;
    this.serverService.listByBatch(this.batch.id).then((storageUnits) => {
      this.storageUnits = storageUnits;
      this.storageUnits.map(su => su.batch = this.batch);
      this.storageUnits.sort((a, b) => {
        let aSlash = a.location.indexOf('/') > -1;
        let bSlash = b.location.indexOf('/') > -1;
        if ((aSlash && bSlash) || (!aSlash && !bSlash)) {
          return a.location.localeCompare(b.location);
        } else {
          return aSlash ? 1 : -1;
        }
      });
      this.loading = false;
      this.listMarkupGroupBatchByBatchId();
    }).catch(error => this.handleError(error));
  }

  listMarkupGroupBatchByBatchId() {
    this.loading = true;
    this.markupGroupService.listMarkupGroupBatchByBatchId(this.batch.id).then((markupGroupBatch) => {
      this.markupGroupBatch = markupGroupBatch;
      this.loadSampleByBatchId();
      this.loading = false;
    }).catch(error => this.handleError(error));
  }

  loadSampleByBatchId() {
    this.loading = true;
    this.sampleService.findByBatchId(this.batch.id).then((sample) => {
      this.sample = sample;
      if (this.sample && this.sample.id && this.sample.status === SampleStatus.RESERVED.code) {
        this.sHasQuantityReserved = true;
      }
      else {
        this.sHasQuantityReserved = false;
      }
      this.makeQuantityReserved();
      this.loading = false;
    }).catch(error => this.handleError(error));
  }

  makeQuantityReserved() {
    for (const mgb of this.markupGroupBatch) {
      if (mgb.markupGroup.type == MarkupGroupType.SHIPPING_AUTHORIZATION.code) {
        this.saQuantityReserved = this.saQuantityReserved + mgb.quantity;
      } else if (mgb.markupGroup.type == MarkupGroupType.SERVICE_INSTRUCTION.code) {
        this.siQuantityReserved = this.siQuantityReserved + mgb.quantity;
      }
    }
  }

  handleError(error) {
    this.loading = false;
    return this.errorHandler.fromServer(error);
  }

  get totalQuantity() {
    if (!this.storageUnits) {
      return 0;
    }

    return this.storageUnits
      .map((su) => su.quantityByBatch)
      .reduce((a, b) => a + b, 0);
  }


  get totalSacksQuantity() {
    return this.kilosSacksConverterService.kilosToSacks(this.totalQuantity, this.batch);
  }

  get totalQuantityString() {
    return NumberHelper.toPTBR(this.totalQuantity);
  }

  get totalSacksQuantityString() {
    return NumberHelper.toPTBR(this.totalSacksQuantity);
  }

  get shippingAuthorizationQuantityReserved() {
    return NumberHelper.toPTBR(this.saQuantityReserved);
  }

  get serviceInstructionQuantityReserved() {
    return NumberHelper.toPTBR(this.siQuantityReserved);
  }

  get sampleHasQuantityReserved() {
    if (this.sHasQuantityReserved) {
      return 'Sim';
    }
    return 'Não';
  }

  openBatch() {
    this.loadingReserved = true;
    this.openReserved = !this.openReserved;
    if(this.openReserved){
      this.batchService.loadQtdReservedByType(this.batch.id).then( res => {
        this.reservedShippingAuthorization = res.reservedShippingAuthorization ? res.reservedShippingAuthorization : 0;
        this.reservedServiceInstruction = res.reservedServiceInstruction ? res.reservedServiceInstruction : 0;
        this.codesShippingAuthorization = res.codeShippingAuthorization && res.codeShippingAuthorization.length > 0 ? res.codeShippingAuthorization : null;
        this.codesServiceInstruction = res.codeServiceInstruction && res.codeServiceInstruction.length > 0 ? res.codeServiceInstruction : null;
        this.loadingReserved = false;
      });
    }
  }

  isOpened(){
    return this.openReserved;
  }

  reservedShippingAuthorizationString() {
    return NumberHelper.toPTBR(this.reservedShippingAuthorization) + ' kg';
  }

  reservedShippingAuthorizationSacksString() {
    let sacks = this.batch != null
      ? NumberHelper.toRounding(this.reservedShippingAuthorization / this.batch.averageWeightSack)
      : NumberHelper.toRounding(this.reservedShippingAuthorization / 60);
    if(sacks === 0 && this.reservedShippingAuthorization > 0){
      sacks = 1;
    }
    return sacks + ' scs';
  }

  codeShippingAuthorizationString() {
    return this.codesShippingAuthorization != null ? this.codesShippingAuthorization.reduce( (c1,c2) => {return c1 + ', ' + c2;} ) : '';
  }

  reservedServiceInstructionString() {
    return NumberHelper.toPTBR(this.reservedServiceInstruction) + ' kg';
  }

  reservedServiceInstructionSacksString() {
    let sacks = this.batch != null
      ? NumberHelper.toRounding(this.reservedServiceInstruction / this.batch.averageWeightSack)
      : NumberHelper.toRounding(this.reservedServiceInstruction / 60);
    if(sacks === 0 && this.reservedServiceInstruction > 0 ){
      sacks = 1;
    }
    return sacks + ' scs';
  }

  codeServiceInstructionString() {
    return this.codesServiceInstruction != null ? this.codesServiceInstruction.reduce( (c1,c2) => {return c1 + ', ' + c2;} ) : '';
  }

}
