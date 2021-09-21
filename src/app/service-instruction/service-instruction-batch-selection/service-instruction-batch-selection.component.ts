import {Component, Input, OnInit, OnDestroy, Output, EventEmitter} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import {ErrorHandler} from '../../shared/errors/error-handler';
import {Notification} from '../../shared/notification/notification';
import {ServiceInstruction} from '../service-instruction';
import {Masks} from '../../shared/forms/masks/masks';
import {Batch} from 'app/batch/batch';
import {WarehouseStakeholderAutocomplete} from 'app/warehouse-stakeholder/warehouse-stakeholder-autocomplete';
import {WarehouseStakeholderService} from 'app/warehouse-stakeholder/warehouse-stakeholder.service';
import {Subscription} from 'rxjs/Rx';
import {SampleTrackingAutocomplete} from 'app/sample-tracking/sample-tracking-autocomplete';
import {SampleTrackingService} from 'app/sample-tracking/sample-tracking.service';
import {BatchService} from 'app/batch/batch.service';
import {BatchOperation} from 'app/batch-operation/batch-operation';
import {WarehouseStakeholder} from 'app/warehouse-stakeholder/warehouse-stakeholder';
import {MarkupGroupBatch} from 'app/markup-group/batch/markup-group-batch';
import {MarkupGroup} from 'app/markup-group/markup-group';
import {ParameterService} from 'app/parameter/parameter.service';
import {Parameter} from 'app/parameter/parameter';
import {ServiceRequestBatch} from 'app/service-request/service-request-batch';
import {SampleStatus} from 'app/sample/sample-status';
import {BatchStatus} from 'app/batch/batch-status';
import {totalmem} from 'os';
import {NumberHelper} from 'app/shared/globalization';
import {ModalManager} from "../../shared/shared.module";
import {ServiceInstructionService} from '../service-instruction.service';
import {AuthService} from "../../auth/auth.service";
import {PackStockService} from "../../pack-stock/pack-stock.service";

@Component({
  selector: 'app-service-instruction-batch-selection',
  templateUrl: './service-instruction-batch-selection.component.html'
})
export class ServiceInstructionBatchSelectionComponent implements OnInit, OnDestroy {
  @Output('reload') reload: EventEmitter<ServiceInstruction> = new EventEmitter<ServiceInstruction>();
  @Input('serviceInstruction') serviceInstruction: ServiceInstruction;
  @Input('isEditable') isEditable: boolean;
  @Input() loading: boolean = false;
  @Input() receiveModal: ModalManager;
  @Input() initProcessModal: ModalManager;
  @Input() taskBatchOperations: Array<BatchOperation> = [];

  form: FormGroup;
  integerMask = Masks.integerMask;
  buscarPor: string;
  listaPesquisaLotes: Array<Batch>;

  selectedLote: Batch;
  loadingReserved: boolean = false;
  reservedShippingAuthorization: number = 0;
  reservedServiceInstruction: number = 0;

  codesShippingAuthorization: Array<string>;
  codesServiceInstruction: Array<string>;


  nenhumLoteEncontrado: boolean = null;

  sampleStatusReserved = SampleStatus.RESERVED;
  ownerAutocomplete: WarehouseStakeholderAutocomplete;

  ownerSubscription: Subscription;
  sampleTrackingAutocomplete: SampleTrackingAutocomplete;

  sampleTrackingSubscription: Subscription;
  parameterBatchDifferent: Parameter = null;

  // para verificar se os batches foram recuperados do serviceRequest
  batchesRecuperados: boolean = false;

  private hiddenPackingData = false;

  get editing() {
    return !!this.serviceInstruction && !!this.serviceInstruction.id;
  }

  constructor(
    private auth: AuthService,
    private formBuilder: FormBuilder,
    private errorHandler: ErrorHandler,
    private warehouseStakeholderService: WarehouseStakeholderService,
    private sampleTrackingService: SampleTrackingService,
    private serviceInstructionService: ServiceInstructionService,
    private batchService: BatchService,
    private parameterService: ParameterService,
    private packStockService: PackStockService
  ) {

  }

  ngOnInit() {
    this.ownerAutocomplete = new WarehouseStakeholderAutocomplete(this.warehouseStakeholderService, this.errorHandler);
    this.sampleTrackingAutocomplete = new SampleTrackingAutocomplete(this.sampleTrackingService, this.errorHandler);
    this.buildForm();
    // verifica parâmetro, para poder selecionar bathces de diferentes clientes
    this.parameterService.findByKey('BATCH_DIFFERENT_CUSTOMER_CAN_MIX').then(parameter => {
      this.parameterBatchDifferent = parameter;
    });

    this.packStockService.hiddenPackingData().then((res) => {
      this.hiddenPackingData = res;
    });

    /*if (this.serviceInstruction && this.serviceInstruction.markupGroup) {
      for (let i of this.serviceInstruction.markupGroup.batches) {
        let balance = i.batch.balance;
        let sacks = i.batch.balanceSacks;
        if (!this.hiddenPackingData && i.batch.indDiscountPack) {
          i.quantity = balance;
          i.quantityString = NumberHelper.toPTBR(i.quantity);
          i.sackQuantity = sacks;
          i.sackQuantityTemp = sacks;
        }
      }
    }*/

    // validação de batches
    setInterval(() => {
      if(this.isEditable)
        this.batchesValidation();
    }, 2000);
  }

  ngOnDestroy() {
    if (this.ownerSubscription != null && !this.ownerSubscription.closed) {
      this.ownerSubscription.unsubscribe();
    }

    if (this.sampleTrackingSubscription != null && !this.sampleTrackingSubscription.closed) {
      this.sampleTrackingSubscription.unsubscribe();
    }
  }

  buildForm() {
    this.form = this.formBuilder.group({
      buscar_por: ['', []],
      buscar_por_cod_lote: ['', []],
      buscar_por_dono_lote: ['', []],
      buscar_por_cod_liga: ['', []],
    });

    this.ownerAutocomplete.value = null;

    this.ownerSubscription = this.ownerAutocomplete.valueChange.subscribe((value) => {
      const id = value ? value.id : null;
      this.form.get('buscar_por_dono_lote').setValue(id);
    });

    this.sampleTrackingAutocomplete.value = null;

    this.sampleTrackingSubscription = this.sampleTrackingAutocomplete.valueChange.subscribe((value) => {
      const id = value ? value.id : null;
      this.form.get('buscar_por_cod_liga').setValue(id);
    });

    // na edição deve vir preenchido como foi feita a busca de lotes
    if (this.serviceInstruction != null && this.serviceInstruction.id != null) {
      if (this.serviceInstruction.sampleTracking != null && this.serviceInstruction.sampleTracking.id != null) {
        this.buscarPor = 'liga';
        this.sampleTrackingAutocomplete.value = this.serviceInstruction.sampleTracking;
      } else {
        this.buscarPor = 'lote';
      }

      this.serviceInstruction.searchForLeague = (this.buscarPor == 'liga');
    }
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
      if (this.serviceInstruction != null && this.serviceInstruction.clientStakeholder != null &&
        this.serviceInstruction.clientStakeholder.id != null) {
        this.form.get('buscar_por_dono_lote').setValue(this.serviceInstruction.clientStakeholder.id);
      }
    }

    this.loading = true;
    this.listaPesquisaLotes = [];
    let filterReceived: Batch = null;
    let filterReceiving: Batch = null;
    let filterBagging: Batch = null;

    if (this.buscarPor == 'lote') {
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

      // não é por liga
      this.serviceInstruction.sampleTracking = null;
    } else if (this.buscarPor == 'liga') {
      if (this.form.get('buscar_por_cod_liga').value != null
        && this.form.get('buscar_por_cod_liga').value != '') {

        filterReceived = new Batch();
        filterReceived.idSampleTracking = this.form.get('buscar_por_cod_liga').value;

        filterReceiving = new Batch();
        filterReceiving.idSampleTracking = this.form.get('buscar_por_cod_liga').value;

        filterBagging = new Batch();
        filterBagging.idSampleTracking = this.form.get('buscar_por_cod_liga').value;
      }

      // por liga
      this.serviceInstruction.sampleTracking = this.sampleTrackingAutocomplete.value;
    }

    if (filterReceived != null && filterReceiving != null && filterBagging != null) {

      // somente lotes recebidos
      filterReceived.status = BatchStatus.RECEIVED.code;
      // somente lotes em recebimento
      filterReceiving.status = BatchStatus.RECEIVING.code;
      // somente lotes em embegamento
      filterBagging.status = BatchStatus.BAGGING.code;

      Promise.all([
        this.batchService.listFilter(filterReceived, false),
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
    } else {
      this.nenhumLoteEncontrado = null;
      this.loading = false;
    }
  }

  handleError(error) {
    this.loading = false;
    return this.errorHandler.fromServer(error);
  }

  buscarPorAlterado() {
    this.nenhumLoteEncontrado = null;
    this.serviceInstruction.searchForLeague = (this.buscarPor == 'liga');
  }

  /**
   * Adiciona lote
   * @param batch
   */
  adicionar(batch: Batch) {
    let mgb = new MarkupGroupBatch();
    mgb.quantity = this.calcBalanceReserved(batch);
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
    if (this.serviceInstruction.markupGroup == null) {
      this.serviceInstruction.markupGroup = new MarkupGroup();
    }

    if (this.serviceInstruction.markupGroup.batches == null) {
      this.serviceInstruction.markupGroup.batches = new Array<MarkupGroupBatch>();
    }

    // não pode adicionar se já existe
    let indice = this.existeLoteSelecionado(markupGroupBatch.batch);
    if (indice == -1)
      this.serviceInstruction.markupGroup.batches.push(markupGroupBatch);

  }

  /**
   * Remove lote da lista
   * @param batch
   */
  remover(batch: Batch) {
    let indice = this.existeLoteSelecionado(batch);

    if (indice < 0) return;

    let boTask = this.taskBatchOperations.find(bo => {
      return bo.markupGroup ? !!bo.markupGroup.batches.find(mgb => mgb.batch.id === batch.id) : false;
    });

    if(boTask) {
      Notification.notification("Não é possível remover o lote da Instrução de Serviço poiso mesmo possui tarefa criada.");
      return;
    };

    this.serviceInstruction.markupGroup.batches.splice(indice, 1);
  }

  /**
   * Confirma Recebimento de um lote no armazem local
   * @param batch
   */
  confirmarRecebimento(markupGroupBatch: MarkupGroupBatch) {
    this.receiveModal.open(markupGroupBatch);
  }

  /**
   * Verifica se o lote informado já está selecionado, retornando o índice do mesmo
   * @param batch
   */
  existeLoteSelecionado(batch: Batch) {
    if (this.serviceInstruction.markupGroup.batches && batch && batch.id) {
      for (let i = 0; i < this.serviceInstruction.markupGroup.batches.length; i++) {
        if (this.serviceInstruction.markupGroup.batches[i].batch.id == batch.id) {
          return i;
        }
      }
    }

    return -1;
  }

  /**
   * Evento realizado quando a quantidade é alterada.
   * @param batchIn
   */
  quantidadeAlterada(evento, batchIn: MarkupGroupBatch) {

    if (batchIn && batchIn.batch && batchIn.batch.id) {
      // verifica se a quantidade informada é maior que zero e não maior que a do batch
      let erro = false;
      if (batchIn.quantity == null || batchIn.quantity <= 0 || (batchIn.id == null ? batchIn.quantity > batchIn.batch.availableWeight : batchIn.quantity > (batchIn.batch.availableWeight + batchIn.quantityTemp))) {
        erro = true;
        // volta ao valor total
        batchIn.quantity = batchIn.batch.availableWeight;
      }

      batchIn.quantity = +(batchIn.quantity.toFixed(2));
      batchIn.kgQuantity = batchIn.quantity;

      // exibe ou esconde mensagem de erro no campo
      document.getElementById("msgQtdeKgBatchId" + batchIn.batch.id).style.display = (erro) ? 'block' : 'none';
    }
  }

  /**
   * Evento realizado quando a quantidade em sacas é alterada.
   *
   * @param batchIn
   */
  sacksChanged(evento, batchIn: MarkupGroupBatch) {

    if (batchIn && batchIn.batch && batchIn.batch.id) {

      // quando é apagado as sacas na digitação, para recuperar precisa ser
      // pelo evento
      batchIn.sackQuantityTemp = evento.currentTarget.value;

      // tenta definir o valor de sacas alterando o peso líquido
      let erro = false;
      try {
        if(batchIn.id != null ? (batchIn.sackQuantityTemp * batchIn.batch.averageWeightSack > (batchIn.batch.availableWeight + batchIn.quantityTemp)) : (batchIn.sackQuantityTemp * batchIn.batch.averageWeightSack > (batchIn.batch.availableWeight)) ){
          erro = true;
          // volta ao valor total
          batchIn.kgQuantity = batchIn.batch.availableWeight;
        }
        batchIn.sackQuantity = Math.round(batchIn.sackQuantityTemp);
      } catch (e) {
        // texto com a mensagem
        document.getElementById("msgQtdeBatchId" + batchIn.batch.id).innerText = e;
        erro = true;
      }

      batchIn.sackQuantity = Math.round(batchIn.sackQuantity);

      // exibe ou esconde mensagem de erro no campo
      document.getElementById("msgQtdeBatchId" + batchIn.batch.id).style.display = (erro) ? 'block' : 'none';
    }
  }

  /**
   * Quantidade total de peso dos lotes selecionados
   */
  getTotalWeight() {

    if (this.serviceInstruction != null && this.serviceInstruction.markupGroup != null) {
      return this.serviceInstruction.markupGroup.getTotalWeight();
    }
    else {
      return NumberHelper.toPTBR(0);
    }
  }

  /**
   * Quantidade total de sacas dos lotes selecionados
   */
  getTotalSacks() {

    let total: number = 0;

    if (this.serviceInstruction != null && this.serviceInstruction.markupGroup != null) {
      total = this.serviceInstruction.markupGroup.getTotalSacks();
    }

    return total;
  }

  /**
   * se existe requisição de serviço com lotes, adiciona-os para exibir na listagem,
   * somente quando vier como parâmetro, ou seja, não é edição de dados.
   * Ocorre somente uma vez.
   */
  verificarBatchesServiceRequest() {

    if (this.editing == false && this.batchesRecuperados == false && this.serviceInstruction != null && this.serviceInstruction.serviceRequest != null
      && this.serviceInstruction.serviceRequest.batches != null && this.serviceInstruction.serviceRequest.batches.length > 0) {

      this.batchesRecuperados = true;

      this.serviceInstruction.serviceRequest.batches.forEach(serviceRequestBatch => {
        this.adicionarDaRequisicaoServico(serviceRequestBatch);
      });
    }
  }

  /**
   * Verificação de batches
   */
  batchesValidation() {
    this.verificarBatchesServiceRequest();

    if (this.serviceInstruction.serviceRequest != null
      && this.serviceInstruction.serviceRequest.batches != null && this.serviceInstruction.serviceRequest.batches.length > 0
      && this.serviceInstruction.markupGroup.batches != null && this.serviceInstruction.markupGroup.batches.length > 0) {

      this.serviceInstruction.markupGroup.batches.forEach(markupGroupBatch => {

        // procura mesmo batch e verifica
        this.serviceInstruction.serviceRequest.batches.forEach(serviceRequestBatch => {

          if (serviceRequestBatch.batch != null && serviceRequestBatch.batch.id == markupGroupBatch.batch.id) {

            // se a quantidade do Batch é maior que o da integração,
            // neste caso utiliza o da integração
            // if (markupGroupBatch.batch.availableWeight > serviceRequestBatch.weight) {
            //   markupGroupBatch.batch.availableWeight = serviceRequestBatch.weight;
            // }

            // se a quantidade de despejo for maior que a quantidade total, altera para a quantidade total
            if(!!this.serviceInstruction.id){
              if (markupGroupBatch.quantity > (markupGroupBatch.batch.availableWeight + markupGroupBatch.quantity)) {
                markupGroupBatch.quantity = (markupGroupBatch.batch.availableWeight + markupGroupBatch.quantity);
              }
            }else {
              if (markupGroupBatch.quantity > markupGroupBatch.batch.availableWeight) {
                markupGroupBatch.quantity = markupGroupBatch.batch.availableWeight;
              }
            }
          }
        });
      });
    }
  }

  validarIniciarProcesso() {
    if (this.serviceInstruction != null
      && this.serviceInstruction.markupGroup
      && this.serviceInstruction.markupGroup.batches
      && this.serviceInstruction.markupGroup.batches.find(b => {
        return !!b.selectedToProccess;
      })) {
      this.initProcessModal.open(this.serviceInstruction);
    } else {
      this.handleError({message: "Ao menos um lote local precisa estar selecionado!"});
    }
  }

  calcBalanceReserved(batch: Batch){
    let balanceReserved = this.calcBalance(batch) - batch.qtdReserved;
    if(balanceReserved < 0)
      return 0;
    else
      return balanceReserved;
  }

  calcBalanceReservedString(batch: Batch) {
    return NumberHelper.toPTBR(this.calcBalanceReserved(batch));
  }

  calcBalanceReservedSacks(batch: Batch){
    if(!batch.averageWeightSack)
      return 0;
    return this.calcBalanceReserved(batch) / batch.averageWeightSack;
  }

  calcBalanceReservedSacksString(batch: Batch) {
    return NumberHelper.toPTBR(this.calcBalanceReservedSacks(batch));
  }

  calcBalance(batch: Batch) {
    if (!batch) {
      return 0;
    }
    if (!this.hiddenPackingData && batch.indDiscountPack) {
      return batch.balance;
    }
    return batch.balance;
  }

  calcBalanceString(batch: Batch) {
    if (!batch) {
      return NumberHelper.toPTBR(0);
    }
    if (!this.hiddenPackingData && batch.indDiscountPack) {
      return NumberHelper.toPTBR(batch.balance);
    }
    return batch.balanceString;
  }

  calcSacks(mgb: MarkupGroupBatch) {
    return Math.round(mgb.quantity / mgb.batch.averageWeightSack);
  }

  openBatch(batch: Batch) {
    this.loadingReserved = true;
    if(this.selectedLote != null && this.selectedLote.id === batch.id){
      this.selectedLote = null;
    }else {
      this.selectedLote = batch;
      this.batchService.loadQtdReservedByType(this.selectedLote.id).then( res => {
        this.reservedShippingAuthorization = res.reservedShippingAuthorization ? res.reservedShippingAuthorization : 0;
        this.reservedServiceInstruction = res.reservedServiceInstruction ? res.reservedServiceInstruction : 0;
        this.codesShippingAuthorization = res.codeShippingAuthorization && res.codeShippingAuthorization.length > 0 ? res.codeShippingAuthorization : null;
        this.codesServiceInstruction = res.codeServiceInstruction && res.codeServiceInstruction.length > 0 ? res.codeServiceInstruction : null;
        this.loadingReserved = false;
      });
    }
  }

  isOpened(batch: Batch){
    return this.selectedLote != null && this.selectedLote.id === batch.id;
  }

  reservedShippingAuthorizationString() {
    return NumberHelper.toPTBR(this.reservedShippingAuthorization) + ' kg';
  }

  reservedShippingAuthorizationSacksString() {
    let sacks = this.selectedLote != null
      ? NumberHelper.toRounding(this.reservedShippingAuthorization / this.selectedLote.averageWeightSack)
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
    let sacks = this.selectedLote != null
      ? NumberHelper.toRounding(this.reservedServiceInstruction / this.selectedLote.averageWeightSack)
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
