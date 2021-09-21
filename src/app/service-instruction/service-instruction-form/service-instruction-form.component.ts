import { ServiceInstructionTask } from './../service-instruction-task';
import { AuthService } from '../../auth/auth.service';
import { Masks } from '../../shared/forms/masks/masks';
import { ErrorHandler } from '../../shared/errors/error-handler';
import { Notification } from '../../shared/notification';
import { Subscription } from 'rxjs/Rx';
import { Component, OnInit, OnDestroy, ViewChild, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ServiceInstruction } from '../service-instruction';
import { ServiceInstructionService } from '../service-instruction.service';
import { ServiceInstructionStatus } from '../service-instruction-status';
import { ServiceInstructionType } from '../../service-instruction-type/service-instruction-type';
import { ServiceInstructionTypeService } from '../../service-instruction-type/service-instruction-type.service';
import { WarehouseService } from '../../warehouse/warehouse.service';
import { Warehouse } from '../../warehouse/warehouse';
import { ServiceInstructionSampleTrackingComponent } from '../service-instruction-sample-tracking/service-instruction-sample-tracking.component';
import { ServiceInstructionTypePurpose } from '../../service-instruction-type/service-instruction-type-purpose';
import { WarehouseStakeholderAutocomplete } from "../../warehouse-stakeholder/warehouse-stakeholder-autocomplete";
import { WarehouseStakeholderService } from "../../warehouse-stakeholder/warehouse-stakeholder.service";
import { ModalManager } from "../../shared/shared.module";
import { ServiceRequest } from 'app/service-request/service-request';
import { ServiceRequestService } from 'app/service-request/service-request.service';
import { ParameterService } from 'app/parameter/parameter.service';
import { Parameter } from "../../parameter/parameter";
import { CollaboratorAutocomplete } from "../../collaborator/collaborator-autocomplete";
import { CollaboratorService } from "../../collaborator/collaborator.service";
import { Transportation } from 'app/transportation/transportation';
import { BatchOperation } from 'app/batch-operation/batch-operation';
import { MarkupGroupBatch } from 'app/markup-group/batch/markup-group-batch';
import { ExpectedResult } from '../expected-result';


@Component({
  selector: 'app-service-instruction-form',
  templateUrl: './service-instruction-form.component.html'
})
export class ServiceInstructionFormComponent implements OnInit, OnDestroy {
  serviceInstruction: ServiceInstruction;
  form: FormGroup;
  @Input() loading: boolean = false;
  integerMask = Masks.integerMask;
  decimalMask = Masks.decimalMask;
  dateMask = Masks.dateMask;
  warehouses: Array<Warehouse> = [];
  types: Array<ServiceInstructionType> = [];
  typeSubscription: Subscription;
  subTypeSubscription: Subscription;
  purposes: Array<ServiceInstructionTypePurpose> = ServiceInstructionTypePurpose.list();
  destinationSubscription: Subscription;
  parameterBatchDifferent: Parameter = null;
  /**
   * Valor padrão de sacas por quilos
   */
  sacksInKilos: number = 0;

  stakeholderAutocomplete: WarehouseStakeholderAutocomplete;
  collaboratorAutocomplete: CollaboratorAutocomplete;

  stakeholderSubscription: Subscription;
  collaboratorSubscription: Subscription;

  finishModal: ModalManager = new ModalManager();
  cancelModal: ModalManager = new ModalManager();
  confirmModal: ModalManager = new ModalManager();
  receiveModal: ModalManager = new ModalManager();
  initProcessModal: ModalManager = new ModalManager();
  reopenModal: ModalManager = new ModalManager();
  criarTarefaModal: ModalManager = new ModalManager();

  serviceRequest: ServiceRequest = null;
  showTransfer: boolean = true;
  labelLocal: string;

  // cofirmação para validação de certificados
  confirmedCertificateValidation: boolean = false;
  confirmCertificateValidation: ModalManager = new ModalManager();
  msgConfirmCertificateValidation: string;
  // para indicar que após a validação dos certificados para a IS, seja confirmado (caso contrário apenas salvo)
  posConfirmCertificateValidationMethodConfirm: boolean;

  warehouseGeneral: boolean = false;
  // para despejo proporcional
  proporcionalEviction: boolean = false;
  proporcionalEvictionMaxQuantity: number = 0;
  proporcionalEvictionValues: Array<Number> = [];

  transportation: Transportation;

  //indica que após a confirmação do modal de validação do certificado, deve abrir o modal de tarefa
  isOpenTaskModal: Boolean = false;
  isOpenEditTaskModal: Boolean = false;

  taskBatchOperations: Array<BatchOperation> = [];

  @ViewChild(ServiceInstructionSampleTrackingComponent)
  private sampleTrackingComponent: ServiceInstructionSampleTrackingComponent;

  batchOperationTaskEditing: BatchOperation;

  get editing() {
    return !!this.serviceInstruction && !!this.serviceInstruction.id;
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private serviceInstructionService: ServiceInstructionService,
    private serviceInstructionTypeService: ServiceInstructionTypeService,
    private warehouseStakeholderService: WarehouseStakeholderService,
    private collaboratorService: CollaboratorService,
    private warehouseService: WarehouseService,
    private auth: AuthService,
    private errorHandler: ErrorHandler,
    private serviceRequestService: ServiceRequestService,
    private parameterService: ParameterService
  ) { }

  ngOnInit() {
    this.warehouseGeneral = this.parameterService.specificParamsServiceInstructionWahehouseGeneral();
    this.proporcionalEviction = this.parameterService.serviceInstructionUseProportionalEviction();
    this.proporcionalEvictionMaxQuantity = this.parameterService.serviceInstructionMaxProportionalEviction();
    this.getProporcionalEvictionValues();

    this.parameterService.sacksInKilos().then((sacksInKilos) => {
      this.sacksInKilos = sacksInKilos;
      this.buildForm();
    });

    // verifica parâmetro, para poder selecionar bathces de diferentes clientes
    this.parameterService.findByKey('BATCH_DIFFERENT_CUSTOMER_CAN_MIX').then(parameter => {
      this.parameterBatchDifferent = parameter;
    });

    this.finishModal.opened = false;
    this.cancelModal.opened = false;
    this.confirmModal.opened = false;
    this.reopenModal.opened = false;

    Notification.clear();
    this.stakeholderAutocomplete = new WarehouseStakeholderAutocomplete(this.warehouseStakeholderService, this.errorHandler);
    this.collaboratorAutocomplete = new CollaboratorAutocomplete(this.collaboratorService, this.errorHandler);
    this.route.data.forEach(
      (data: { serviceInstruction: ServiceInstruction }) => {
        this.serviceInstruction = data.serviceInstruction;
        this.buildForm();
        this.serviceInstructionTypeService.list().then(types => {
          this.types = types;
          //this.verifyTypes();
        }).catch(error => this.handleError(error));
        this.warehouseService.list().then(warehouses => {

          this.warehouses = warehouses;

          if (!this.serviceInstruction.destinationWarehouse)
            this.form.get('destinationWarehouseId').setValue(this.auth.accessToken.warehouse.id);

        }).catch(error => this.handleError(error));
      });

    // se tem requisição de serviço nos parâmetros, recupera-o
    this.route.queryParams.subscribe(params => {

      if (params['serviceRequestId'] != null) {

        // busca requisição de serviço
        this.serviceRequestService.find(params['serviceRequestId']).then(serviceRequest => {
          this.serviceRequest = serviceRequest;
          this.serviceInstruction.serviceRequest = this.serviceRequest;
          // utiliza a mesma observação
          this.form.get('observation').setValue(this.serviceRequest.observation);
          if (!this.serviceInstruction.observation)
            this.serviceInstruction.observation = this.serviceRequest.observation;

          // utiliza o mesmo colaborador se houver
          if (this.serviceRequest.collaborator != null && this.serviceRequest.collaborator.id) {

            this.collaboratorAutocomplete.value = this.serviceRequest.collaborator;
            this.serviceInstruction.collaborator = this.serviceRequest.collaborator;
            this.buildForm();

          }
          this.buildForm();
        });
      }
    });
  }

  podeSelecionarLotesDiferentesClientes() {

    if (this.parameterBatchDifferent != null) {
      return (this.parameterBatchDifferent.value != 'N');
    }

    return true;
  }

  isArmazemGeral(): boolean {
    let isArmazemGeral = this.auth.findParameterValue('SERVICE_INSTRUCTION_FOR');
    return isArmazemGeral !== null && isArmazemGeral === 'Armazém Geral'
  }

  buildForm() {

    // se a média por bag não está definida utiliza o valor padrão
    if (this.serviceInstruction != null && !this.serviceInstruction.averageWeightBag) {
      this.serviceInstruction.averageWeightBag = this.sacksInKilos;
    }

    // se o cadastro vier de uma service request, não pode editar o campo de destino do warehouse,
    // e o mesmo é definido pelo campo warehouse do service request.
    let disabledWarehouse = this.disabledWarehouse;
    /*let warehouseId = (this.serviceInstruction.serviceRequest != null
      && this.serviceInstruction.serviceRequest.warehouse != null)
      ? this.serviceInstruction.serviceRequest.warehouse.id
      : (this.serviceInstruction.destinationWarehouse ? this.serviceInstruction.destinationWarehouse.id : '');*/
    let warehouseId = this.serviceInstruction.destinationWarehouse ?
      this.serviceInstruction.destinationWarehouse.id : this.auth.accessToken.warehouse;

    this.form = this.formBuilder.group({
      'code': [this.serviceInstruction.code || '', []],
      /*'name': [{
        value: this.serviceInstruction.name || '',
        disabled: !this.isNewOrOpened
      }, [Validators.required]],*/
      'collaborator': [{
        value: this.serviceInstruction.collaborator ? this.serviceInstruction.collaborator.label : '',
        disabled: !this.isNewOrOpenedOrInProgress
      },
      !this.isArmazemGeral() ? [Validators.required] : []
      ],
      'client': [{
        value: this.serviceInstruction.clientStakeholder ? this.serviceInstruction.clientStakeholder.label : '',
        disabled: !this.isNewOrOpenedOrInProgress
      },
      this.isArmazemGeral() ? [Validators.required] : []
      ],
      'openedDateString': [
        this.serviceInstruction.openedDateString || '',
        []
      ],
      'closedDateString': [
        this.serviceInstruction.closedDateString || '',
        []
      ],
      'status': [
        this.serviceInstruction.statusObject
          ? this.serviceInstruction.statusObject.name || ''
          : '', []],
      'typeId': [{
        value: this.serviceInstruction.type ? this.serviceInstruction.type.id : '',
        disabled: !this.isNew
      }, [Validators.required]],
      'subTypeId': [{
        value: this.serviceInstruction.subtype ? this.serviceInstruction.subtype : '',
        disabled: !this.isNewOrOpenedOrInProgress
      }, []],
      'destinationWarehouseId': [
        {
          value: warehouseId ? warehouseId : '',
          disabled: !this.isNewOrOpenedOrInProgress
        }, [Validators.required]
      ],
      'observation': [{
        value: this.serviceInstruction.observation || '',
        disabled: !this.isNewOrOpenedOrInProgress
      }, []],
      'referenceCode': [{
        value: this.serviceInstruction.clientReferenceCode || '',
        disabled: !this.isNewOrOpenedOrInProgress
      }, []],
      'lossBySolidString': [{
        value: this.serviceInstruction.lossBySolidString || '',
        disabled: this.isFinished
      }, []],
      'lossByDustString': [{
        value: this.serviceInstruction.lossByDustString || '',
        disabled: this.isFinished
      }, []],
      'sampleWithdrawalString': [{
        value: this.serviceInstruction.sampleWithdrawalString || '',
        disabled: this.isFinished
      }, []],
      'indicationSpecialCoffeeString': [{
        value: this.serviceInstruction.indicationSpecialCoffeeString || 'false',
        disabled: !this.isNewOrOpenedOrInProgress
      }, [Validators.required]],
      'averageWeightBagString': [{
        value: this.serviceInstruction.averageWeightBagString || '',
        disabled: !this.isNewOrOpenedOrInProgress
      }, [Validators.required]],
      'sacksDifferenceString': [this.serviceInstruction.sacksDifferenceString || ''],
      'weightDifferenceString': [this.serviceInstruction.weightDifferenceString || ''],
      'proportionalDumpingStepsString': [{
        value: this.serviceInstruction.proportionalDumpingStepsString || '',
        disabled: !this.isNewOrOpenedOrInProgress
      }, this.proporcionalEviction ? [Validators.required] : []],
      'proportionalDumpingObservation': [{
        value: this.serviceInstruction.proportionalDumpingObservation || '',
        disabled: !this.isNewOrOpenedOrInProgress
      }, []],
    });

    if (this.isNewOrOpenedOrInProgress) {
      this.typeSubscription = this.form.get('typeId').valueChanges
        .subscribe((typeId) => {
          this.serviceInstruction.type = this.types.find(type => type.id === typeId);
          this.setRequireds();
        })

      this.subTypeSubscription = this.form.get('subTypeId').valueChanges
        .subscribe((subTypeId) => {
          this.serviceInstruction.subtype = this.purposes.find(purpose => purpose.code === subTypeId).code;
        })

      this.destinationSubscription = this.form.get('destinationWarehouseId').valueChanges
        .subscribe((destinationWarehouseId) => {
          this.serviceInstruction.destinationWarehouse = this.warehouses
            .find(warehouse => warehouse.id === destinationWarehouseId);
        })
      this.stakeholderAutocomplete.value = this.serviceInstruction.clientStakeholder;
      this.collaboratorAutocomplete.value = this.serviceInstruction.collaborator;

      this.stakeholderSubscription = this.stakeholderAutocomplete.valueChange.subscribe((value) => {
        const id = value ? value.id : null;
        this.form.get('client').setValue(id);
        this.serviceInstruction.clientStakeholder = this.stakeholderAutocomplete.value;
      });

      this.collaboratorSubscription = this.collaboratorAutocomplete.valueChange.subscribe((value) => {
        const id = value ? value.id : null;
        this.form.get('collaborator').setValue(id);
        this.serviceInstruction.collaborator = this.collaboratorAutocomplete.value;
      });
    }
  }

  get destinationWarehouses() {
    return this.warehouses;
  }

  save() {
    this.loading = false;
    if (this.isConfirmedOrFinished) {
      return Promise.reject("Form inválido");
    }
    Object.keys(this.form.controls).forEach(key => {
      this.form.controls[key].markAsDirty();
    });

    if (!this.form.valid) {
      return Promise.reject("Form inválido");
    }

    let sumSacksBatches = 0;
    if (this.serviceInstruction &&
      this.serviceInstruction.markupGroup &&
      this.serviceInstruction.markupGroup.batches &&
      this.serviceInstruction.markupGroup.batches.length) {
      sumSacksBatches = this.serviceInstruction.markupGroup.batches.reduce((sum, item) => {
        return sum + item.sackQuantity;
      }, 0);
    }

    let maxSacksService = 0;
    if (this.serviceInstruction &&
      this.serviceInstruction.services &&
      this.serviceInstruction.services.length) {
      maxSacksService = this.serviceInstruction.services.reduce((max, item) => {
        return max<item.serviceSacksQuantity?item.serviceSacksQuantity:max;
      }, 0);
    }

    if (sumSacksBatches < maxSacksService && !this.serviceInstruction.isCharge) {
      let msgExcessServiceSacks = 'Número de sacas dos serviços não pode exceder número de sacas dos lotes selecionados';
      Notification.error(msgExcessServiceSacks);
      return Promise.reject(msgExcessServiceSacks);
    }

    // verifica se precisa confirmar os lotes com certificados
    if (this.needConfirmCertificateValidation()) {
      this.loading = false;
      this.posConfirmCertificateValidationMethodConfirm = false;
      this.confirmCertificateValidation.open(null);

      return Promise.reject("Precisa de confirmação da validação de certificado");
    }

    this.loading = true;

    // não precisa mais o nome
    //this.serviceInstruction.name = this.form.value.name;

    if (this.serviceInstruction.status == null) {
      this.serviceInstruction.status = ServiceInstructionStatus.OPENED.code;
    }

    this.serviceInstruction.observation = this.form.value.observation;
    // this.serviceInstruction.sacksQuantity = this.sampleTrackingComponent.sumSacksOut;
    this.serviceInstruction.clientStakeholder = this.stakeholderAutocomplete.value;
    this.serviceInstruction.collaborator = this.collaboratorAutocomplete.value;
    this.serviceInstruction.indicationSpecialCoffeeString = this.form.value.indicationSpecialCoffeeString;
    this.serviceInstruction.averageWeightBagString = this.form.value.averageWeightBagString;
    this.serviceInstruction.clientReferenceCode = this.form.value.referenceCode;
    this.serviceInstruction.proportionalDumpingStepsString = this.form.value.proportionalDumpingStepsString;
    this.serviceInstruction.proportionalDumpingObservation = this.form.value.proportionalDumpingObservation;
    this.serviceInstruction.destinationWarehouse = this.warehouses.find(warehouse => warehouse.id === this.form.value.destinationWarehouseId);

    // solicitação de serviço vinda da listagem dela TODO: arrumar quando vir destination
    /*if (this.serviceRequest != null && this.serviceRequest.id != null) {
      this.serviceInstruction.serviceRequest = this.serviceRequest;
      // quando tem solicitação o warehouse vem dela
      this.serviceInstruction.destinationWarehouse = this.warehouses.find(warehouse => warehouse.id === this.serviceInstruction.serviceRequest.warehouse.id);
    }*/

    // quando busca para lote, deve remover alguma liga que possa estar selecionada
    if (!this.serviceInstruction.searchForLeague) {
      this.serviceInstruction.sampleTracking = null;
    }

    return this.serviceInstructionService
      .save(this.serviceInstruction)
      .then((response) => {
        this.serviceInstruction = ServiceInstruction.fromData(response);

        this.loading = false;
        Notification.success('Instrução de Serviço salva com sucesso!');
        //this.router.navigate(['/service-instruction']);
      })
      .catch(error => this.handleError(error));
  }

  setRequireds() {
    if (!this.isArmazemGeral() && !this.serviceInstruction.isForSale)
      this.form.controls["collaborator"].setValidators(Validators.required);
    else
      this.form.controls["collaborator"].setValidators(null);

    if (this.isArmazemGeral() && !this.serviceInstruction.isForSale)
      this.form.controls["client"].setValidators(Validators.required);
    else
      this.form.controls["client"].setValidators(null);

    if (!this.serviceInstruction.isForSale)
      this.form.controls["destinationWarehouseId"].setValidators(Validators.required);
    else
      this.form.controls["destinationWarehouseId"].setValidators(null);

    this.form.controls["collaborator"].updateValueAndValidity();
    this.form.controls["client"].updateValueAndValidity();
    this.form.controls["destinationWarehouseId"].updateValueAndValidity();
  }

  confirm() {

    Object.keys(this.form.controls).forEach(key => {
      this.form.controls[key].markAsDirty();
    });

    if (!this.form.valid) {
      return;
    }

    this.loading = true;

    this.serviceInstruction.clientStakeholder = this.stakeholderAutocomplete.value;
    this.serviceInstruction.collaborator = this.collaboratorAutocomplete.value;
    this.serviceInstruction.observation = this.form.value.observation;
    this.serviceInstruction.observation2 = this.form.value.observation;
    this.serviceInstruction.indicationSpecialCoffeeString = this.form.value.indicationSpecialCoffeeString;
    this.serviceInstruction.averageWeightBagString = this.form.value.averageWeightBagString;
    this.serviceInstruction.proportionalDumpingStepsString = this.form.value.proportionalDumpingStepsString;
    this.serviceInstruction.proportionalDumpingObservation = this.form.value.proportionalDumpingObservation;
    this.serviceInstruction.clientReferenceCode = this.form.value.referenceCode;

    // quando tem solicitação o warehouse vem dela TODO: arrumar quando vir destination
    /*if ((this.serviceRequest != null && this.serviceRequest.id != null) || this.serviceInstruction.serviceRequest != null) {
      this.serviceInstruction.serviceRequest = (this.serviceRequest || this.serviceInstruction.serviceRequest);
      this.serviceInstruction.destinationWarehouse = this.warehouses.find(warehouse => warehouse.id === this.serviceInstruction.serviceRequest.warehouse.id);
    }*/

    if (!this.serviceInstruction.isForSale && !this.serviceInstruction.isCharge) {
      this.serviceInstruction.markupGroup.batches = this.serviceInstruction.markupGroup.batches.map(b => {
        b.selectedToProccess = false;
        if (b.batch && b.batch.localWithAuth(this.auth) && !b.processed) {
          b.selectedToProccess = true;
        }
        return b;
      });
    }


    if (this.hasContaminants()) {
      Notification.notification('Lote(s) possuem presença de contaminantes.');
    }

    return this.serviceInstructionService
      .confirm(this.serviceInstruction)
      .then(() => {
        Notification.success('Instrução de Serviço confirmada com sucesso!');
        this.router.navigate(['/service-instruction']);
      }).catch(error => this.handleError(error));
  }

  cancel() {
    this.serviceInstructionService.cancel(this.serviceInstruction.id)
      .then(() => {
        Notification.success('Instrução de serviço cancelada com sucesso!');
        this.router.navigate(['/service-instruction']);
      }).catch(error => this.handleError(error));
  }

  sendMail() {
    this.serviceInstructionService.sendMail(this.serviceInstruction.id)
      .then(() => {
        Notification.success('Email enviado com sucesso!');
      }).catch(error => this.handleError(error));
  }

  printOrientation() {
    this.serviceInstructionService.printOrientation(this.serviceInstruction.id)
      .catch(error => this.handleError(error));

    this.serviceInstructionService.printProportionalEvictionReport(this.serviceInstruction.id)
      .catch(error => this.handleError(error));
  }

  finish() {

    Object.keys(this.form.controls).forEach(key => {
      this.form.controls[key].markAsDirty();
    });

    if (!this.form.valid) {
      return;
    }

    this.loading = true;

    this.serviceInstruction.lossBySolidString = this.form.value.lossBySolidString;
    this.serviceInstruction.lossByDustString = this.form.value.lossByDustString;
    this.serviceInstruction.sampleWithdrawalString = this.form.value.sampleWithdrawalString;

    return this.serviceInstructionService
      .finish(this.serviceInstruction)
      .then(() => {
        Notification.success('Instrução de Serviço finalizada com sucesso!');
        this.router.navigate(['/service-instruction']);
      })
      .catch(error => this.handleError(error));
  }

  reopen() {
    this.loading = true;
    return this.serviceInstructionService
      .reopen(this.serviceInstruction)
      .then(() => {
        Notification.success('Instrução de Serviço reaberta com sucesso!');
        this.router.navigate(['/service-instruction']);
      })
      .catch(error => this.handleError(error));
  }

  ngOnDestroy() {
    let subscriptions = [
      this.typeSubscription,
      this.subTypeSubscription,
      this.destinationSubscription,
      this.stakeholderSubscription,
      this.collaboratorSubscription
    ];
    subscriptions.forEach((subscription: Subscription) => {
      if (subscription && !subscription.closed) {
        subscription.unsubscribe();
      }
    });

  }

  handleError(error) {
    this.loading = false;
    return this.errorHandler.fromServer(error);
  }

  get showExpectedResults() {
    return this.serviceInstruction &&
      this.serviceInstruction.isRebenefit;
  }

  get showBatchesOut() {
    return this.serviceInstruction.isFinished && !this.serviceInstruction.isForSale;
  }

  get showCreateTaskButton(){
    return this.serviceInstruction.isRebenefit;
  }

  get showFinishButton(){
    return this.serviceInstruction.isConfirmed || this.serviceInstruction.isInProgress || this.serviceInstruction.isOpened;
  }

  get showConfirmButton(){
    return !this.serviceInstruction.isRebenefit &&
      (this.serviceInstruction.isAwaitingConfirmation || this.serviceInstruction.isNew || this.serviceInstruction.isOpened);
  }

  get isConfirmed() {
    return this.serviceInstruction
      && this.serviceInstruction.id
      && this.serviceInstruction.status
      && this.serviceInstruction.status === ServiceInstructionStatus.CONFIRMED.code;
  }

  get isConfirmedOrFinished() {
    return this.serviceInstruction
      && this.serviceInstruction.id
      && this.serviceInstruction.status
      && (this.serviceInstruction.status === ServiceInstructionStatus.CONFIRMED.code
        || this.serviceInstruction.status === ServiceInstructionStatus.FINISHED.code);
  }

  get isOpened() {
    return this.serviceInstruction
      && this.serviceInstruction.id
      && this.serviceInstruction.status
      && this.serviceInstruction.status === ServiceInstructionStatus.OPENED.code;
  }

  get isInProgress() {
    return this.serviceInstruction
      && this.serviceInstruction.id
      && this.serviceInstruction.status
      && this.serviceInstruction.status === ServiceInstructionStatus.IN_PROCESS.code;
  }

  get isAwaitingBatchAvailability() {
    return this.serviceInstruction
      && this.serviceInstruction.id
      && this.serviceInstruction.status
      && this.serviceInstruction.status === ServiceInstructionStatus.AWAITING_BATCH.code;
  }

  get isAwaitingConfirmation() {
    return this.serviceInstruction
      && this.serviceInstruction.id
      && this.serviceInstruction.status
      && this.serviceInstruction.status === ServiceInstructionStatus.AWAITING_CONFIRM.code;
  }

  get isNewOrOpenedOrInProgress() {
    return this.serviceInstruction
      && (!this.serviceInstruction.status
        || (this.serviceInstruction.status === ServiceInstructionStatus.OPENED.code)
        || (this.serviceInstruction.status === ServiceInstructionStatus.IN_PROCESS.code));
  }

  get isNew() {
    return this.serviceInstruction
      && (!this.serviceInstruction.status);
  }

  get isFinished() {
    return this.serviceInstruction
      && this.serviceInstruction.id
      && this.serviceInstruction.status
      && this.serviceInstruction.status === ServiceInstructionStatus.FINISHED.code;
  }

  get disabledWarehouse() {
    return (
      this.serviceInstruction.isForSale
    );
  }

  /**
   * Verifica os tipos disponíveis para cadastro
   */
  verifyTypes() {
    /**
     * No campo Tipo, que é mostrado na tela em componente do tipo Lista,
     * são mostrados os 3 tipos possíveis de Instruções de Serviço:  Guia de Serviço, Liga e Transferência.
     * Neste campo o Tipo Transferência deve passar a aparecer na Lista SE E SOMENTE SE na Companhia na qual
     * o usuário logado está vinculado existir mais de um Armazém cadastrado.
     * Se houver somente 1 armazém, o tipo Transferência NÃO DEVE APARECER NA Lista.
     * Se houver mais de 1 armazém, o Tipo Transferência deve continuar aparecendo na Lista.
     *
     * REMOÇÃO DESSA REGRA NA ATIVIDADE ACTA-248 Usuários não possuem a opção de IS de transferência.
     */
    let quantityWarehousesFromUser = (this.auth.warehouses != null) ? this.auth.warehouses.length : 0;
    this.showTransfer = (quantityWarehousesFromUser > 1);

    /*
    if (this.showTransfer == false && this.types != null && this.types.length > 0) {

      let index = -1;

      for (let i = 0; i < this.types.length; i++) {
        if (this.types[i].code == 'TR') {
          index = i;
          break;
        }
      }

      if (index > -1) {
        this.types.splice(index, 1);
      }
    }*/

    /**
     * Label para campo de Local/Destino
     *
     * No campo Local/Destino é identificado o Armazém onde será realizada a execução do serviço, ou então,
     * o Armazém de destino no caso de transferências. Este campo deverá ter o seu funcionamento alterado de acordo
     * com a quantidade de armazéns vinculados a companhia no qual o usuário está vinculado (calculado no item 2, logo acima).
     * Portanto:
     * Se houver somente 1 armazém:
     * •  O label do campo deverá ser alterado para “Local”
     * •  O Hint existente no campo ao lado do label deve ser alterado para “Armazém para execução do serviço
     * •  O único armazém existente já deverá vir previamente selecionado na Lista
     * Se houver mais de 1 armazém, nenhuma alteração deverá ser efetuada no campo, ou seja,
     * deve continuar a ter o mesmo comportamento atual.
     */
    this.labelLocal = (this.showTransfer) ? "Local/Destino" : "Local";
  }

  /**
   * Verifica a necessidade de confirmação da validação  dos certificados
   */
  needConfirmCertificateValidation(): boolean {

    /**
     Ao se selecionar um Lote na lista para fazer parte da Instrução de Serviço,
     deve-se analisar o conteúdo do campo “Serão despejados cafés certificados?:

     Caso este campo esteja marcado com o valor NÃO e estiver sendo selecionado um Lote que possua certificado
     deve-se mostrar a seguinte mensagem de ALERTA com as opções Sim e Não
     “A Instrução de Serviço está marcada para não receber Café certificado e está sendo selecionado
     Lote(s) de Café Certificado. Deseja continuar (S/N).
     Caso a resposta seja Não, deve-se abandonar a seleção do Lote.
     Caso a resposta seja Sim, permitir a seleção do Lote de Café Certificado.

     Caso este campo esteja marcado com o valor SIM e estiver sendo selecionado um Lote que NÃO possua certificado
     deve-se mostrar a seguinte mensagem de ALERTA com as opções Sim e Não
     “A Instrução de Serviço está marcada para receber Café certificado e está sendo selecionado
     Lote(s) de Café Não Certificado. Deseja continuar (S/N).
     Caso a resposta seja Não, deve-se abandonar a seleção do Lote.
     Caso a resposta seja Sim, permitir a seleção do Lote de Café Não Certificado.

     Caso este campo esteja marcado com o valor SIM e estiver sendo selecionado um Lote que possua certificado,
     nenhuma mensagem deve ser apresentada.

     Caso este campo esteja marcado com o valor NÃO e estiver sendo selecionado um Lote que Não possua certificado,
     nenhuma mensagem deve ser apresentada.
     */

    // ainda não confirmado
    if (this.confirmedCertificateValidation == false) {

      let indicationSpecialCoffee = (this.form.value.indicationSpecialCoffeeString != null
        && (this.form.value.indicationSpecialCoffeeString == 'true'))
        ? true : false;

      let haveBatchesSelected = false;
      let haveAnyBatchCertificate = false;
      let haveAnyBatchNotCertificate = false;

      if (this.serviceInstruction != null && this.serviceInstruction.markupGroup != null
        && this.serviceInstruction.markupGroup.batches != null && this.serviceInstruction.markupGroup.batches.length > 0) {

        haveBatchesSelected = true;
        this.serviceInstruction.markupGroup.batches.forEach(markupGroupBatch => {

          if (markupGroupBatch.batch != null && markupGroupBatch.batch.batchOperation != null) {

            if (markupGroupBatch.batch.batchOperation.certificates != null
              && markupGroupBatch.batch.batchOperation.certificates.length > 0) {
              haveAnyBatchCertificate = true;
            } else {
              haveAnyBatchNotCertificate = true;
            }

          }
        });

        // para validar precisa ter batches selecionados
        if (haveBatchesSelected) {

          if (indicationSpecialCoffee == false && haveAnyBatchCertificate) {

            this.msgConfirmCertificateValidation = 'A Instrução de Serviço está marcada para não receber Café certificado '
              + 'e está sendo selecionado Lote(s) de Café Certificado. Deseja continuar?';
            return true;
          } else if (indicationSpecialCoffee == true && haveAnyBatchNotCertificate) {

            this.msgConfirmCertificateValidation = 'A Instrução de Serviço está marcada para receber Café certificado '
              + 'e está sendo selecionado Lote(s) de Café Não Certificado. Deseja continuar?';
            return true;
          }
        }
      }
    }

    return false;
  }

  /**
   * Confirmação da validação dos certificados pelo usário
   */
  setConfirmCertificateValidation() {
    this.confirmedCertificateValidation = true;

    if (this.posConfirmCertificateValidationMethodConfirm) {
      this.validateConfirm();
      return;
    }

    this.save()
    .then(() => {
      if(this.isOpenTaskModal) {
        this.criarTarefaModal.open(new ServiceInstructionTask());
        this.isOpenTaskModal = false;
      } else if(this.isOpenEditTaskModal) {
        this.editTaskModal(this.batchOperationTaskEditing);
        this.isOpenEditTaskModal = false;
      }
    })
    .catch();

  }

  /**
   * Valores para despejo proporcional
   */
  getProporcionalEvictionValues() {

    let retorno: Array<Number> = [];

    if (this.proporcionalEviction && this.proporcionalEvictionMaxQuantity) {

      for (let i = 1; i <= this.proporcionalEvictionMaxQuantity; i++) {
        retorno.push(i);
      }
    }

    this.proporcionalEvictionValues = retorno;
  }

  receive(dataFromModal) {
    //TODO
    (<any>jQuery)('.modal').modal('hide');
    this.serviceInstructionService.receive(dataFromModal.batchId, dataFromModal.markupGroupBatchId, this.serviceInstruction)
      .then((res) => {
        this.serviceInstruction = res;
        Notification.success('Recebimento confirmado com sucesso');
      })
      .catch(error => this.handleError(error));
  }


  /**
   * Iniciar processo de lotes locais selecionados
   */
  iniciarProcesso(serviceInstruction) {
    this.loading = true;
    this.serviceInstructionService.partialConfirm(serviceInstruction).then(serviceInstructionResponse => {
      this.serviceInstruction.markupGroup.batches = this.serviceInstruction.markupGroup.batches.map((bLocal) => {
        bLocal.processed = serviceInstructionResponse.markupGroup.batches.find(bResponse => {
          bLocal.selectedToProccess = false;
          return bResponse.id === bLocal.id
        }).processed;
        return bLocal;
      });
      this.loading = false;
    }).catch(error => {
      this.handleError(error);
      this.loading = false;
    });
  }

  validateConfirm() {

    let error = false;

    let sumSacksBatches = 0;
    if (this.serviceInstruction &&
      this.serviceInstruction.markupGroup &&
      this.serviceInstruction.markupGroup.batches &&
      this.serviceInstruction.markupGroup.batches.length) {
      sumSacksBatches = this.serviceInstruction.markupGroup.batches.reduce((sum, item) => {
        return sum + item.sackQuantity;
      }, 0);
    }

    let maxSacksService = 0;
    if (this.serviceInstruction &&
      this.serviceInstruction.services &&
      this.serviceInstruction.services.length) {

      let validItens = true;

      this.serviceInstruction.services.forEach( i => {
        validItens = validItens && (i.chargeSacksQuantity === undefined || i.chargeSacksQuantity === null
          || i.chargeApproved !== undefined || i.chargeSacksQuantity >= i.serviceSacksQuantity );
      });

      if(!validItens){
        Notification.error("Serviços pendentes de aprovação.")
        return;
      }

      maxSacksService = this.serviceInstruction.services.reduce((max, item) => {
        return max<item.serviceSacksQuantity?item.serviceSacksQuantity:max;
      }, 0);
    }

    if (sumSacksBatches < maxSacksService && !this.serviceInstruction.isCharge) {
      Notification.error('Número de sacas dos serviços não pode exceder número de sacas dos lotes selecionados');
      return;
    }


    if (!this.serviceInstruction.isForSale && !this.serviceInstruction.isCharge) {

      if (!this.serviceInstruction.services || !this.serviceInstruction.services.length) {
        this.handleError({ message: "Não há serviços a serem executados" });
        error = true;
      }

      if (!this.serviceInstruction.markupGroup ) {
        this.handleError({ message: "Não há lotes a serem executados" });
        error = true;
      }
    }

    if (!error) {

      // verifica se precisa confirmar os lotes com certificados
      if (!this.serviceInstruction.isCharge && this.needConfirmCertificateValidation()) {
        this.loading = false;
        this.posConfirmCertificateValidationMethodConfirm = true;
        this.confirmCertificateValidation.open(null);
        return;
      }

      this.confirmModal.open(true);
    }
  }

  hasContaminants() {
    if (!this.serviceInstruction || !this.serviceInstruction.markupGroup) return false;
      let hasContaminants = false;
      this.serviceInstruction.markupGroup.batches.forEach(b => {
      if (b.batch.contaminants && b.batch.contaminants.find(i => i.traceable) != null || this.serviceInstruction.hasTraceableContaminant) {
        hasContaminants = true;
      }
    });
    return hasContaminants;
  }


  //TODO mudar nome do metodo: esse aqui é o que executa quando clica no botão "Criar Tarefa" (nova)
  modalCriarTarefa() {
    //caso nao tenha lote selecionado nao deve abrir  o modal pra criação de tarefa
    if(!this.serviceInstruction.markupGroup ||
      !this.serviceInstruction.markupGroup.batches ||
      !this.serviceInstruction.markupGroup.batches.length){
        Notification.notification('Sem lotes selecionados!')
        return;
    }
    //caso ja tenha sido criado tarefa de todos os lotes, não abre o modal
     if(this.serviceInstruction.markupGroup.getTotalWeightNumber() <=
      this.serviceInstruction.markupGroup.getCurrentWeightNumber()){
        Notification.notification('Já foi criado tarefa para todos os lotes!')
        return;
      }


    this.loading = !this.loading;
    this.isOpenTaskModal = true;

    this.save()
    .then(() => this.criarTarefaModal.open(new ServiceInstructionTask()))
    .catch();

	}

  editTaskModal(batchOperationOut: BatchOperation) {
    this.batchOperationTaskEditing = batchOperationOut;

    //seta o markupGroupBatchParent para ter a informação de qual foi o batch da IS que deu origem a esse batch da Task
    // (para calcular a quantidade máxima do batch, por exemplo)
    batchOperationOut.markupGroup.batches.forEach(b => {
      b.markupGroupBatchParent =
      this.serviceInstruction.markupGroup.batches.find(sb => sb.batch.batchCode === b.batch.batchCode);
    });

    let task: ServiceInstructionTask = new ServiceInstructionTask();

    task.taskBatches = MarkupGroupBatch.fromListData(batchOperationOut.markupGroup.batches);
    task.taskOrder = batchOperationOut.taskOrder;
    task.taskExpectedResults = this.serviceInstruction.expectedResults.filter(e => e.taskOrder === batchOperationOut.taskOrder);

    this.loading = !this.loading;
    this.isOpenEditTaskModal = true;

    this.save()
    .then(() => this.criarTarefaModal.open(task))
    .catch();
	}

  deleteTask(batchOperation: BatchOperation) : Promise<void>{
    let task: ServiceInstructionTask = new ServiceInstructionTask();
    task.taskOrder = batchOperation.taskOrder;

    this.loading = true;

    return this.serviceInstructionService.deleteTask(this.serviceInstruction, task)
    .then(() => {
      Notification.success("Tarefa removida com sucesso.");
      this.subtractServiceInstructionMarkupGroupBatchCurrentQuantity(batchOperation);
      this.removeTaskExpectedResults(batchOperation.taskOrder);
      this.loading = false;
    })
    .catch((error) => this.handleError(error));
  }

  /**
   * Atualiza o current quantity do markupGroupBatch com a subtração do valor do lote da BatchOperation
   *
   * @param batchOperation
   */
  subtractServiceInstructionMarkupGroupBatchCurrentQuantity(batchOperation: BatchOperation) {
    batchOperation.markupGroup.batches.forEach(boMgb => {
      let siMgb = this.serviceInstruction.markupGroup.batches.find(siMgb => boMgb.batch.id === siMgb.batch.id);
      siMgb.currentQuantity -= boMgb.quantity;
    });
  }

  /**
   * Remove expectedResults com a taskOrder
   * @param taskOrder
   */
  removeTaskExpectedResults(taskOrder: number) {
    this.serviceInstruction.expectedResults.forEach((er, i) => {
      if(er.taskOrder === taskOrder) this.serviceInstruction.expectedResults.splice(i, 1);
    });
  }

  //import shipping autorization config
  get hasBatches(){
    return this.markupGroup.batches.length > 0 ;
  }
  get markupGroup() {
    return this.transportation.batchOperationOut.markupGroup;
  }
  get shippingAuthorization() {
    return this.transportation.batchOperationOut.shippingAuthorization;
  }
  get shippingData(){
    return this.transportation.batchOperationOut.shippingData;
  }


}
