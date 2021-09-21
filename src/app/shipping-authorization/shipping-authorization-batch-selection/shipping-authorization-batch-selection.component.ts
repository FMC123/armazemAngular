import {Component, Input, OnInit, OnDestroy, SimpleChanges, OnChanges} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import {MarkupGroupBatch} from "../../markup-group/batch/markup-group-batch";
import {WarehouseStakeholder} from "../../warehouse-stakeholder/warehouse-stakeholder";
import {Masks} from "../../shared/forms/masks/masks";
import {Batch} from "../../batch/batch";
import {SampleStatus} from "../../sample/sample-status";
import {WarehouseStakeholderAutocomplete} from "../../warehouse-stakeholder/warehouse-stakeholder-autocomplete";
import {Subscription} from "rxjs";
import {ErrorHandler} from "../../shared/errors/error-handler";
import {WarehouseStakeholderService} from "../../warehouse-stakeholder/warehouse-stakeholder.service";
import {SampleTrackingService} from "../../sample-tracking/sample-tracking.service";
import {BatchService} from "../../batch/batch.service";
import {ParameterService} from "../../parameter/parameter.service";
import {Parameter} from "../../parameter/parameter";
import {BatchOperation} from "../../batch-operation/batch-operation";
import {BatchStatus} from "../../batch/batch-status";
import {ServiceRequestBatch} from "../../service-request/service-request-batch";
import {NumberHelper} from "../../shared/globalization";
import {PackStockService} from "../../pack-stock/pack-stock.service";


@Component({
  selector: 'app-shipping-authorization-batch-selection',
  templateUrl: './shipping-authorization-batch-selection.component.html'
})
export class ShippingAuthorizationBatchSelectionComponent implements OnInit, OnDestroy, OnChanges {
  @Input('markupGroupBatches') markupGroupBatches: Array<MarkupGroupBatch>;
  @Input('ownerFixed') ownerFixed: WarehouseStakeholder;
  @Input('isEditable') isEditable: boolean;
  form: FormGroup;
  loading: boolean = false;
  integerMask = Masks.integerMask;
  listaPesquisaLotes: Array<Batch>;
  nenhumLoteEncontrado: boolean = null;
  sampleStatusReserved = SampleStatus.RESERVED;

  ownerAutocomplete: WarehouseStakeholderAutocomplete;
  ownerSubscription: Subscription;

  parameterBatchDifferent: Parameter = null;
  // para verificar se os batches foram recuperados do serviceRequest
  batchesRecuperados: boolean = false;

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

    // verifica parâmetro, para poder selecionar bathces de diferentes clientes
    this.parameterService.findByKey('BATCH_DIFFERENT_CUSTOMER_CAN_MIX').then(parameter => {
      this.parameterBatchDifferent = parameter;
    });

    if (this.markupGroupBatches && this.markupGroupBatches.length) {
      for (let i of this.markupGroupBatches) {
        let balance = this.calcBalance(i.batch);
        let sacks = this.calcSacks(i.batch);
        if (!this.hiddenPackingData && i.batch.indDiscountPack) {
          i.quantity = balance;
          i.quantityString = NumberHelper.toPTBR(i.quantity);
          i.sackQuantity = sacks;
          i.sackQuantityTemp = sacks;
        }
      }
    }

    // validação de batches
    setInterval(() => {
      this.batchesValidation();
    }, 2000);
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

    this.ownerAutocomplete.value = null;

    this.ownerSubscription = this.ownerAutocomplete.valueChange.subscribe((value) => {
      const id = value ? value.id : null;
      this.form.get('buscar_por_dono_lote').setValue(id);
    });

  }

  cleanForm() {
  }

  /**
   * Para verificar se pode selecionar batches de diferentes clientes
   */
  podeSelecionarLotesDiferentesClientes() {

    if (this.parameterBatchDifferent != null) {
      return (this.parameterBatchDifferent.value != 'N');
    }

    return true;
  }

  /**
   * Pesquisa lotes
   */
  pesquisar() {

    // se não pode pesquisar em diferentes clientes, define diretamente o que foi especificado no início do cadastro
    if (this.podeSelecionarLotesDiferentesClientes() == false) {
        this.form.get('buscar_por_dono_lote').setValue(this.ownerFixed.id);
    }

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

  /**
   * Adiciona lote
   * @param batch
   */
  adicionar(batch: Batch) {
    let mgb = new MarkupGroupBatch();
    mgb.quantity = (batch.availableWeight - batch.warrantReservedQtd);
    mgb.batch = batch;
    this.adicionarBatch(mgb);
  }


  /**
   * Adiciona lote pela requisição de serviço
   * @param serviceRequestBatch
   */
  adicionarDaRequisicaoServico(serviceRequestBatch: ServiceRequestBatch) {

    // somente os lotes cadastrados podem ser adicionados
    if (serviceRequestBatch.batch != null) {

      let mgb = new MarkupGroupBatch();
      mgb.quantity = serviceRequestBatch.weight;
      mgb.batch = serviceRequestBatch.batch;
      this.adicionarBatch(mgb);
    }
  }

  /**
   * Adiciona lote na listagem efetivamente
   * @param markupGroupBatch
   */
  adicionarBatch(markupGroupBatch: MarkupGroupBatch) {

    if (this.markupGroupBatches == null) {
      this.markupGroupBatches = new Array<MarkupGroupBatch>();
    }

    // não pode adicionar se já existe
    let indice = this.existeLoteSelecionado(markupGroupBatch.batch);
    if (indice == -1)
      this.markupGroupBatches.push(markupGroupBatch);

  }

  /**
   * Remove lote da lista
   * @param batch
   */
  remover(batch: Batch) {

    let indice = this.existeLoteSelecionado(batch);
    if (indice >= 0) {
      this.markupGroupBatches.splice(indice, 1);
    }
  }

  /**
   * Verifica se o lote informado já está selecionado, retornando o índice do mesmo
   * @param batch
   */
  existeLoteSelecionado(batch: Batch) {

    if (this.markupGroupBatches && batch && batch.id)
      return this.markupGroupBatches.findIndex(mgb => mgb.batch.id == batch.id);

    return -1;
  }

  /**
   * Evento realizado quando a quantidade é alterada.
   * @param batchIn
   */
  quantidadeAlterada(evento, batchIn: MarkupGroupBatch) {

    //TODO: Refazer, está complexo demais para uma validação tão simples
    if(!this.isCalcManual(batchIn)){
      if (batchIn && batchIn.batch && batchIn.batch.id) {
        // batchIn.weightSack = 0;
        // verifica se a quantidade informada é maior que zero e não maior que a do batch
        let erro = false;

        let removedQuantity = batchIn.id ? batchIn.quantityTemp : 0;

        if (batchIn.quantity == null || batchIn.quantity <= 0 || (batchIn.quantity - removedQuantity > (batchIn.batch.balance - batchIn.batch.warrantReservedQtd )) ) {
          erro = true;
          // volta ao valor total
          batchIn.quantity = batchIn.quantity > 0 ? (batchIn.batch.balance + removedQuantity - batchIn.batch.warrantReservedQtd) : 1;
        }

        // batchIn.kgQuantity = evento.currentTarget.value;
        batchIn.kgQuantity = batchIn.quantity ;

        // exibe ou esconde mensagem de erro no campo
        // document.getElementById("msgQtdeKgBatchId" + batchIn.batch.id).style.display = (erro) ? 'block' : 'none';
      }
    }
  }

  /**
   * Evento realizado quando a quantidade em sacas é alterada.
   *
   * @param batchIn
   */
  sacksChanged(evento, batchIn: MarkupGroupBatch) {

    //TODO: Refazer, está complexo demais para uma validação tão simples
    if(!this.isCalcManual(batchIn)){
      if (batchIn && batchIn.batch && batchIn.batch.id) {
        // batchIn.weightSack = 0;
        // quando é apagado as sacas na digitação, para recuperar precisa ser
        // pelo evento
        batchIn.sackQuantityTemp = parseInt(evento.currentTarget.value);

        let removedSackQuantity = batchIn.id ? batchIn.sackQuantityOriginal : 0 ;

        // tenta definir o valor de sacas alterando o peso líquido
        let erro = false;
        try {
          batchIn.sackQuantity = batchIn.sackQuantityTemp;
          let balanceSacks = batchIn.batch.balanceSacks;
          if(batchIn.sackQuantity == null || batchIn.sackQuantity <= 0 || batchIn.sackQuantity - removedSackQuantity > balanceSacks){
            batchIn.sackQuantity = batchIn.sackQuantity > 0 ? batchIn.batch.balanceSacks + removedSackQuantity : 1 ;
            throw new Error(`O despejo deve ser um valor entre 1 e ${batchIn.batch.balanceSacks}`);
          }
        }
        catch (e) {
          // texto com a mensagem

          document.getElementById("msgQtdeBatchId" + batchIn.batch.id).innerText = e;
          erro = true;
        }

        batchIn.sackQuantity = Math.round(batchIn.sackQuantity);
        // exibe ou esconde mensagem de erro no campo
        // document.getElementById("msgQtdeBatchId" + batchIn.batch.id).style.display = (erro) ? 'block' : 'none';
      }
    }
    else {
      batchIn.updateWeightSack = NumberHelper.fromPTBR(evento.currentTarget.value);
    }
  }

  /**
   * Quantidade total de peso dos lotes selecionados
   */
  getTotalWeight() {

    let total: number = 0;

    if (this.markupGroupBatches != null && this.markupGroupBatches.length > 0) {

      this.markupGroupBatches.forEach(mgb => {
        total = total + mgb.quantity;
      });
    }

    return NumberHelper.toPTBR(total);
  }

  /**
   * Quantidade total de sacas dos lotes selecionados
   */
  getTotalSacks() {

    let total: number = 0;

    if (this.markupGroupBatches != null && this.markupGroupBatches.length > 0) {

      this.markupGroupBatches.forEach(mgb => {
        total = total + mgb.sackQuantity;
      });

      return total;
    }
  }

  /**
   * se existe requisição de serviço com lotes, adiciona-os para exibir na listagem,
   * somente quando vier como parâmetro, ou seja, não é edição de dados.
   * Ocorre somente uma vez.
   */
  verificarBatchesServiceRequest() {

    if (this.markupGroupBatches != null && this.markupGroupBatches.length > 0) {

      this.batchesRecuperados = true;

      this.markupGroupBatches.forEach(serviceRequestBatch => {
        this.adicionarDaRequisicaoServico(serviceRequestBatch);
      });
    }
  }

  /**
   * Verificação de batches
   */
  batchesValidation() {

    this.verificarBatchesServiceRequest();

    if (this.markupGroupBatches != null && this.markupGroupBatches.length > 0) {

      this.markupGroupBatches.forEach(markupGroupBatch => {

        // procura mesmo batch e verifica
        this.markupGroupBatches.forEach(serviceRequestBatch => {

          if (serviceRequestBatch.batch != null && serviceRequestBatch.batch.id == markupGroupBatch.batch.id) {

            // se a quantidade de despejo for maior que a quantidade total, altera para a quantidade total
            if(!!markupGroupBatch.id){
              if (markupGroupBatch.quantity > (markupGroupBatch.batch.balance + markupGroupBatch.quantity)) {
                markupGroupBatch.quantity = (markupGroupBatch.batch.balance + markupGroupBatch.quantity);
              }
            }else {
              if (markupGroupBatch.quantity > markupGroupBatch.batch.balance) {
                markupGroupBatch.quantity = markupGroupBatch.batch.balance;
              }
            }
          }
        });
      });
    }
  }

  desabilitarBotaoPesquisarLote(){
    return (this.podeSelecionarLotesDiferentesClientes() == false && !this.ownerFixed) || (this.podeSelecionarLotesDiferentesClientes() && !this.form.get('buscar_por_dono_lote').value);
  }

  isCalcManual(batchIn: MarkupGroupBatch): boolean {
    return batchIn.calcManual;
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

  calcBalanceWithRetentnionString(batch :Batch) {
    if (!batch) {
      return NumberHelper.toPTBR(0);
    }

    if(batch.warrantReservedQtd != null)
      return NumberHelper.toPTBR(batch.balance - batch.warrantReservedQtd);

    return batch.balanceString;
  }

  calcQtdReserved(batch :Batch){
    if (!batch) {
      return NumberHelper.toPTBR(0);
    }

    if(batch.warrantReservedQtd != null)
      return NumberHelper.toPTBR(batch.qtdReserved + batch.warrantReservedQtd);

    return batch.qtdReservedString;
  }

  calcSacks(batch: Batch) {
    if (!this.hiddenPackingData && batch.indDiscountPack) {
      let balance = batch.balance;
      return Math.round(batch.balance / (batch.averageWeightSack * (balance / batch.netWeight )));
    }else{
      return Math.round(batch.balance / batch.averageWeightSack);
    }
  }
}
