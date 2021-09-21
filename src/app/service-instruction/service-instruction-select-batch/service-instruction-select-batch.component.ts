import { ServiceInstructionTask } from './../service-instruction-task';
import {Component, Input, OnInit, OnDestroy, Output, EventEmitter} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule
} from '@angular/forms';
import {ErrorHandler} from '../../shared/errors/error-handler';
import {ServiceInstruction} from '../service-instruction';
import {Masks} from '../../shared/forms/masks/masks';
import {Batch} from 'app/batch/batch';
import {WarehouseStakeholderAutocomplete} from 'app/warehouse-stakeholder/warehouse-stakeholder-autocomplete';
import {WarehouseStakeholderService} from 'app/warehouse-stakeholder/warehouse-stakeholder.service';
import {Subscription} from 'rxjs/Rx';
import {SampleTrackingAutocomplete} from 'app/sample-tracking/sample-tracking-autocomplete';
import {SampleTrackingService} from 'app/sample-tracking/sample-tracking.service';
import {BatchService} from 'app/batch/batch.service';
import {MarkupGroupBatch} from 'app/markup-group/batch/markup-group-batch';
import {MarkupGroup} from 'app/markup-group/markup-group';
import {ParameterService} from 'app/parameter/parameter.service';
import {Parameter} from 'app/parameter/parameter';
import {ServiceRequestBatch} from 'app/service-request/service-request-batch';
import {SampleStatus} from 'app/sample/sample-status';
import {NumberHelper} from 'app/shared/globalization';
import {ModalManager} from "../../shared/shared.module";
import {ServiceInstructionService} from '../service-instruction.service';
import {AuthService} from "../../auth/auth.service";
import {PackStockService} from "../../pack-stock/pack-stock.service";
import {BatchOperation} from "app/batch-operation/batch-operation";
import { ServiceInstructionStatus } from '../service-instruction-status';
import { Notification } from './../../shared/notification/notification';
import { ServiceInstructionFormComponent } from '../service-instruction-form/service-instruction-form.component';
import { ExpectedResult } from '../expected-result';
import { Router } from '@angular/router';


@Component({
  selector: 'app-service-instruction-select-batch',
  templateUrl: './service-instruction-select-batch.component.html',
  styleUrls: ['./service-instruction-select-batch.component.css']
})
export class ServiceInstructionSelectBatchComponent implements OnInit, OnDestroy {
  @Output('reload') reload: EventEmitter<ServiceInstruction> = new EventEmitter<ServiceInstruction>();
  @Input('serviceInstruction') serviceInstruction: ServiceInstruction;
  @Input('isEditable') isEditable: boolean = true;
  @Input() loading: boolean = false;
  @Input() receiveModal: ModalManager;
  @Input() initProcessModal: ModalManager;
  @Input() taskModal: ModalManager;
  @Input() task: ServiceInstructionTask;

  //serviceInstruction.task.markupGroup.markupGroupBatches = serviceInstruction.batchOperationList.markupGroupBatches;

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

  batchesRecuperados: boolean = false;

  serviceInstructionMgBatch: Array<MarkupGroupBatch> = new Array();
  
  weightBagString: any;

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
    private packStockService: PackStockService,
    private router: Router
  ) {

  }

  ngOnInit() {
    this.ownerAutocomplete = new WarehouseStakeholderAutocomplete(this.warehouseStakeholderService, this.errorHandler);
    this.sampleTrackingAutocomplete = new SampleTrackingAutocomplete(this.sampleTrackingService, this.errorHandler);
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

    this.weightBagString = this.serviceInstruction.averageWeightBagString;

    this.getListBatches();
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


  handleError(error) {
    this.loading = false;
    return this.errorHandler.fromServer(error);
  }

  /**
   * Adiciona lote
   * @param batch
   */
  adicionar(markupGroupBatch: MarkupGroupBatch) {
    let taskMgb = new MarkupGroupBatch();
    taskMgb.quantity = markupGroupBatch.leftQuantity;
    taskMgb.batch = markupGroupBatch.batch;
    taskMgb.markupGroupBatchParent = markupGroupBatch;
    taskMgb.selectedToProccess = true;

    this.adicionarBatch(taskMgb);
  }


  /**
   * Adiciona lote pela requisição de serviço
   * @param serviceRequestBatch
   */
  adicionarDaRequisicaoServico(serviceRequestBatch: ServiceRequestBatch) {

    // somente os lotes cadastrados podem ser adicionados
    if (serviceRequestBatch.batch != null) {

      let mgb = new MarkupGroupBatch();
      // mgb.quantity = serviceRequestBatch.weight;
      // mgb.batch = serviceRequestBatch.batch;
      this.adicionarBatch(mgb);
    }
  }

  /**
   * Adiciona lote na listagem efetivamente
   * @param markupGroupBatch
   */
  adicionarBatch(markupGroupBatch: MarkupGroupBatch) {

    // não pode adicionar se já existe
    let indice = this.existeLoteSelecionadoNaLista(this.task.taskBatches, markupGroupBatch.batch);
    if (indice == -1)
      this.task.taskBatches.push(markupGroupBatch);
  }

  /**
   * Remove lote da lista
   * @param batch
   */
  remover(batch: Batch) {
    let indice = this.existeLoteSelecionado(batch);
    if (indice >= 0) {
      this.task.taskBatches.splice(indice, 1);
    }
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
    if (this.task.taskBatches && batch && batch.id) {
      return this.existeLoteSelecionadoNaLista(this.task.taskBatches, batch);
    }

    return -1;
  }

  existeLoteSelecionadoNaLista(batches: Array<MarkupGroupBatch>, batch: Batch) {
    for (let i = 0; i < batches.length; i++) {
      if (batches[i].batch.id == batch.id) {
        return i;
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
      // verifica se a quantidade informada é maior que o executado (0 no caso de novo) e não maior que a do selecionado na IS
      let erro = false;
      if (batchIn.quantity == null || batchIn.quantity < batchIn.currentQuantity) {
        erro = true;
        // caso o inputado seja menor, seta o valor mínimo
        batchIn.quantity = batchIn.currentQuantity;
      // } else if (batchIn.id == null ? batchIn.quantity > batchIn.markupGroupBatchParent.quantity : batchIn.quantity > batchIn.markupGroupBatchParent.leftQuantity) {
      } else if (batchIn.quantity > batchIn.markupGroupBatchParent.leftQuantity) {
        erro = true;
        batchIn.quantity = batchIn.markupGroupBatchParent.leftQuantity;
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
        if(batchIn.sackQuantityTemp * batchIn.batch.averageWeightSack > (batchIn.markupGroupBatchParent.leftQuantity) ){
          erro = true;
          // volta ao valor máximo
          batchIn.kgQuantity = batchIn.markupGroupBatchParent.leftQuantity;
        } else if (batchIn.sackQuantityTemp * batchIn.batch.averageWeightSack < (batchIn.currentQuantity) ){
          erro = true;
          batchIn.kgQuantity = batchIn.currentQuantity;
          batchIn.quantity = batchIn.currentQuantity;
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

  saveTask() {
    this.loading = true;
    return this.serviceInstructionService.saveTask(this.serviceInstruction, this.task)
    .then(() => {
      Notification.success('Tarefa salva com sucesso!');
      //this.taskModal.close();
      (<any>jQuery)('.modal').modal('hide');
      this.router.navigateByUrl('/', {skipLocationChange: true}).then(()=>
        this.router.navigateByUrl('/service-instruction/edit/' + this.serviceInstruction.id)
      );
    })
    .catch(error => this.handleError(error));
  }

  getListBatches(){
    if(!this.serviceInstruction || !this.serviceInstruction.markupGroup) return;
    this.serviceInstruction.markupGroup.batches.forEach(res => {
      if(res.batch.localWithAuth(this.auth) != true || res.leftQuantity <= 0) return;

      const mgb = MarkupGroupBatch.fromData(res);
        
      const taskMgb = this.task.taskBatches.find(mgbTask => mgbTask.batch.id === mgb.batch.id);

      // if(taskMgb) mgb.currentQuantity -= taskMgb.quantity;
      if(taskMgb)  { 
        mgb.currentQuantity -= taskMgb.quantity;
        taskMgb.markupGroupBatchParent = mgb;
      }
      
      this.serviceInstructionMgBatch.push(mgb);
    });
  }
}
