import {Component, Input, OnInit, OnDestroy, SimpleChanges, OnChanges, Output, EventEmitter} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import {WarehouseStakeholder} from "../../warehouse-stakeholder/warehouse-stakeholder";
import {Masks} from "../../shared/forms/masks/masks";
import {Batch} from "../../batch/batch";
import {WarehouseStakeholderAutocomplete} from "../../warehouse-stakeholder/warehouse-stakeholder-autocomplete";
import {Subscription} from "rxjs";
import {ErrorHandler} from "../../shared/errors/error-handler";
import {WarehouseStakeholderService} from "../../warehouse-stakeholder/warehouse-stakeholder.service";
import {SampleTrackingService} from "../../sample-tracking/sample-tracking.service";
import {BatchService} from "../../batch/batch.service";
import {ParameterService} from "../../parameter/parameter.service";
import {BatchOperation} from "../../batch-operation/batch-operation";
import {BatchStatus} from "../../batch/batch-status";
import {NumberHelper} from "../../shared/globalization";
import {PackStockService} from "../../pack-stock/pack-stock.service";
import {RetentionBatch} from "../retention-batch";


@Component({
  selector: 'app-warrant-control-batch-selection',
  templateUrl: './warrant-control-batch-selection.component.html'
})
export class WarrantControlBatchSelectionComponent implements OnInit, OnDestroy, OnChanges {
  @Input('retentionBatches') retentionBatches: Array<RetentionBatch>;
  @Input('totalQuantity') totalQuantity: string;
  @Input('totalSacksQuantity') totalSacksQuantity: number;
  @Input('ownerFixed') ownerFixed: WarehouseStakeholder;
  @Input('isEditable') isEditable: boolean;
  @Output('quantityChange') quantityChange = new EventEmitter();

  form: FormGroup;
  loading: boolean = false;
  integerMask = Masks.integerMask;
  listaPesquisaLotes: Array<Batch>;
  nenhumLoteEncontrado: boolean = null;

  ownerAutocomplete: WarehouseStakeholderAutocomplete;
  ownerSubscription: Subscription;


  private hiddenPackingData = false;

  constructor(
    private formBuilder: FormBuilder,
    private errorHandler: ErrorHandler,
    private warehouseStakeholderService: WarehouseStakeholderService,
    private sampleTrackingService: SampleTrackingService,
    private batchService: BatchService,
    private parameterService: ParameterService,
    private packStockService: PackStockService
  ) { }

  ngOnInit() {
    this.packStockService.hiddenPackingData().then((res) => {
      this.hiddenPackingData = res;
    });

    this.ownerAutocomplete = new WarehouseStakeholderAutocomplete(this.warehouseStakeholderService, this.errorHandler);
    this.buildForm();

  }

  ngOnChanges(changes: SimpleChanges) {
    for (const propName in changes) {
      if (changes.hasOwnProperty(propName)) {
        switch (propName) {
          case 'ownerFixed': {
            this.listaPesquisaLotes = [];
          }
        }
      }
    }
  }

  ngOnDestroy() {
    if (this.ownerSubscription != null && !this.ownerSubscription.closed) {
      this.ownerSubscription.unsubscribe();
    }
  }

  buildForm() {
    this.form = this.formBuilder.group({
      buscar_por: ['', []],
      buscar_por_cod_lote: ['', []],
      buscar_por_dono_lote: ['', []],
    });

    this.ownerSubscription = this.ownerAutocomplete.valueChange.subscribe((value) => {
      const id = value ? value.id : null;
      this.form.get('buscar_por_dono_lote').setValue(id);
    });


    this.ownerAutocomplete.value = this.ownerFixed;

  }

  cleanForm() {
  }

  /**
   * Pesquisa lotes
   */
  pesquisar() {
      this.form.get('buscar_por_dono_lote').setValue(this.ownerFixed.id);


    this.loading = true;
    this.listaPesquisaLotes = [];
    let filterReceived: Batch = null;
    let filterReceiving: Batch = null;
    let filterBagging: Batch = null;

    if (this.form.get('buscar_por_dono_lote').value != '' ||
      this.form.get('buscar_por_cod_lote').value != '') {
      filterReceived = new Batch();
      filterReceived.batchCode = this.form.get('buscar_por_cod_lote').value;
      filterReceived.batchOperation = new BatchOperation();
      filterReceived.batchOperation.owner = new WarehouseStakeholder();
      filterReceived.batchOperation.owner.id = this.form.get('buscar_por_dono_lote').value;

      filterReceiving = new Batch();
      filterReceiving.batchCode = this.form.get('buscar_por_cod_lote').value;
      filterReceiving.batchOperation = new BatchOperation();
      filterReceiving.batchOperation.owner = new WarehouseStakeholder();
      filterReceiving.batchOperation.owner.id = this.form.get('buscar_por_dono_lote').value;

      filterBagging = new Batch();
      filterBagging.batchCode = this.form.get('buscar_por_cod_lote').value;
      filterBagging.batchOperation = new BatchOperation();
      filterBagging.batchOperation.owner = new WarehouseStakeholder();
      filterBagging.batchOperation.owner.id = this.form.get('buscar_por_dono_lote').value;
    }

    if (filterReceived != null && filterReceiving != null) {
      // somente lotes recebidos
      filterReceived.status = BatchStatus.RECEIVED.code;
      // somente lotes em recebimento
      filterReceiving.status = BatchStatus.RECEIVING.code;
      // somente lotes em embegamento
      filterBagging.status = BatchStatus.BAGGING.code;

      Promise.all([
        this.batchService.listFilter(filterReceived, true),
        this.batchService.listFilter(filterReceiving, true),
        this.batchService.listFilter(filterBagging, true),
      ]).then((responses) => {
        let listaPesquisaLotesAux: Array<Batch>;
        listaPesquisaLotesAux = responses[0];
        this.listaPesquisaLotes = listaPesquisaLotesAux.concat(responses[1]);
        this.listaPesquisaLotes = this.listaPesquisaLotes.concat(responses[2]);
        this.loading = false;
        this.nenhumLoteEncontrado = (this.listaPesquisaLotes == null || this.listaPesquisaLotes.length == 0);
      }).catch(error => this.handleError(error));
    }
    else {
      this.nenhumLoteEncontrado = null;
      this.loading = false;
    }
  }

  handleError(error) {
    this.loading = false;
    return this.errorHandler.fromServer(error);
  }

  adicionar(batch: Batch) {
    let rtb = new RetentionBatch();
    rtb.quantity = batch.availableWeight;
    rtb.batch = batch;
    this.adicionarBatch(rtb);
  }

  adicionarBatch(retentionBatch: RetentionBatch) {

    if (this.retentionBatches == null) {
      this.retentionBatches = new Array<RetentionBatch>();
    }

    // não pode adicionar se já existe
    let indice = this.existeLoteSelecionado(retentionBatch.batch);
    if (indice == -1) {
      this.retentionBatches.push(retentionBatch);
      this.totalQuantity = this.getTotalWeight();
      this.totalSacksQuantity = this.getTotalSacks();
      this.quantityChange.emit();
    }


  }

  remover(batch: Batch) {

    let indice = this.existeLoteSelecionado(batch);
    if (indice >= 0) {
      this.retentionBatches.splice(indice, 1);
      this.totalQuantity = this.getTotalWeight();
      this.totalSacksQuantity = this.getTotalSacks();
      this.quantityChange.emit();
    }
  }

  existeLoteSelecionado(batch: Batch) {

    if (this.retentionBatches && batch && batch.id)
      return this.retentionBatches.findIndex(mgb => mgb.batch.id == batch.id);

    return -1;
  }

  quantidadeAlterada(event, batchIn: RetentionBatch) {
    if(batchIn.batch.balance >= event.currentTarget.value && event.currentTarget.value >=0){
      batchIn.quantity = event.currentTarget.value;
    } else {
      batchIn.quantity = 0;
    }
    this.quantityChange.emit();
  }

  sacksChanged(event, batchIn: RetentionBatch) {
    const batchSackQuantity = batchIn.batch.balanceSacks || null;
    if(batchSackQuantity && batchSackQuantity >= event.currentTarget.value && event.currentTarget.value >=0 ){
      batchIn.sacksQuantity = event.currentTarget.value;
    } else {
      batchIn.sacksQuantity = 0;
    }
    this.quantityChange.emit();
  }

  getTotalWeight() {
    let total: number = 0;

    if (this.retentionBatches != null && this.retentionBatches.length > 0) {

      this.retentionBatches.forEach(batch => {
        total = Number(total) + Number((batch.quantity || 0));
      });
    }

    return NumberHelper.toPTBR(total);
  }

  getTotalSacks() {
    let total: number = 0;

    if (this.retentionBatches != null && this.retentionBatches.length > 0) {

      this.retentionBatches.forEach(batch => {
        total = Number(total) + Number((batch.sacksQuantity || 0));
      });

      return total;
    }
    return 0;
  }


  desabilitarBotaoPesquisarLote(){
    return  !this.ownerFixed;
  }

  calcBalance(batch :Batch) {
    if (!batch) {
      return 0;
    }
    if (!this.hiddenPackingData && batch.indDiscountPack) {
      return batch.balance;
    }
    return batch.balance;
  }

  calcBalanceString(batch :Batch) {
    if (!batch) {
      return NumberHelper.toPTBR(0);
    }
    if (!this.hiddenPackingData && batch.indDiscountPack) {
      return NumberHelper.toPTBR(batch.balance);
    }
    return batch.balanceString;
  }
}
