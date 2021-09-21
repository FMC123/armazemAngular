import {ServiceChargeService} from '../../service-charge/service-charge.service';
import {BatchOperationType} from './../batch-operation-type';
import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';

import {OperationType} from '../../operation-type/operation-type';
import {OperationTypeService} from '../../operation-type/operation-type.service';
import {ErrorHandler} from '../../shared/errors/error-handler';
import {Masks} from '../../shared/forms/masks/masks';
import {ModalManager} from '../../shared/modals/modal-manager';
import {Notification} from '../../shared/notification';
import {Transportation} from '../../transportation/transportation';
import {User} from '../../user/user';
import {UserService} from '../../user/user.service';
import {BatchOperation} from '../batch-operation';
import {BatchOperationStatus} from '../batch-operation-status';
import {BatchOperationService} from '../batch-operation.service';
import {AuthService} from '../../auth/auth.service';
import {BatchService} from "../../batch/batch.service";
import {TypeCoffee} from "../../pack-type/type-coffee";
import {ParameterService} from 'app/parameter/parameter.service';
import {Batch} from '../../batch/batch';
import {DateTimeHelper} from "../../shared/globalization";

@Component({
  selector: 'app-batch-operation-in-form',
  templateUrl: 'batch-operation-in-form.component.html'
})

export class BatchOperationInFormComponent implements OnInit {

  loading: boolean = false;

  batchOperation: BatchOperation;
  transportation: Transportation;
  form: FormGroup;
  showServiceChargeForm = false;

  integerMask = Masks.integerMask;
  decimalMask = Masks.decimalMask;
  dateMask = Masks.dateMask;
  users: Array<User>;
  operationTypes: Array<OperationType> = [];
  reloadChildren = true;
  closeConfirm = new ModalManager();
  parameterEnableButtonReabrir = false;
  operationTypeDefault;

  // para confirmar peso dos batches diferentes do romaneio
  confirmDifferenceBatchWeightModal = new ModalManager();
  confirmedDifferenceBatchWeight: boolean = false;

  get readOnly() {
    return this.batchOperation.status === BatchOperationStatus.CLOSED.code || this.batchOperation.status === BatchOperationStatus.STORED.code;
  }

  get enableButtonReabrir() {

    let enable = false;

    if (this.batchOperation != null && this.batchOperation.status != null
      && this.batchOperation.type !== 'OT_IN'
      && (this.batchOperation.status === BatchOperationStatus.CLOSED.code
        || this.batchOperation.status === BatchOperationStatus.STORED.code
      )) {
      enable = true;
    }
    else {
      return false;
    }

    return enable && !!this.authService.accessToken.leader && !!this.parameterEnableButtonReabrir;
  }

  get editing() {
    return !!this.batchOperation && !!this.batchOperation.id;
  }

  constructor(private route: ActivatedRoute,
              private router: Router,
              private formBuilder: FormBuilder,
              private batchOperationService: BatchOperationService,
              private userService: UserService,
              private operationTypeService: OperationTypeService,
              private serviceChargeService: ServiceChargeService,
              private batchService: BatchService,
              private authService: AuthService,
              private errorHandler: ErrorHandler,
              private parameterService: ParameterService) {
  }

  ngOnInit() {
    Notification.clearErrors();
    this.userService.list().then(users => {
      this.users = users;
    })
      .catch((error) => this.errorHandler.fromServer(error))

    this.route.data.forEach((data: { batchOperation: BatchOperation, transportation: Transportation }) => {
      this.batchOperation = data.batchOperation;
      this.transportation = data.transportation;
    });

    this.loadOperationTypeInfo().then(r => {
      this.buildForm();
    });

    this.serviceChargeService.hiddenChargesForEntry().then((parameter) => {
      this.showServiceChargeForm = !parameter;
    });

    this.parameterEnableButtonReabrir = this.authService.findParameterBoolean('ENABLE_BUTTON_REABRIR_ENTR_SAIDA');
  }

  updateBatches() {
    this.batchService.list(this.batchOperation.id).then(batches => {
      const updatePromises = [];
      for (const b of batches) {
        if (b.typeCoffee !== TypeCoffee.PERSONALIZADO.code) {
          b.typeCoffee = TypeCoffee.PERSONALIZADO.code;
          const p = this.batchService.save(b);
          updatePromises.push(p);
        }
      }
      return Promise.all(updatePromises);
    }).catch(error => this.errorHandler.fromServer);
  }

  get infoLeft() {
    if (!this.batchOperation) {
      return [];
    }

    let cooperado = (this.batchOperation.collaborator != null && this.batchOperation.collaborator.person != null)
      ? this.batchOperation.collaborator.code + '-' + this.batchOperation.collaborator.person.name
      : (this.batchOperation.owner != null && this.batchOperation.owner.person != null) ? this.batchOperation.owner.person.name : '';


    if (this.batchOperation.type === BatchOperationType.P_IN.code) {
      return [
        ['Número do Romaneio', this.batchOperation.batchOperationCode],
        ['Cliente', cooperado],
        ['Data de lançamento', this.batchOperation.createdDateString],
        ['Quantidade', this.batchOperation.sacksQuantity],
        ['Peso Bruto', this.batchOperation.grossWeightString],
      ];
    }
    else {
      return [
        ['Número do Romaneio', this.batchOperation.batchOperationCode],
        ['Cliente', cooperado],
        ['Data de lançamento', this.batchOperation.createdDateString],
        ['Placa 1', this.transportation.vehiclePlate1 || ''],
        ['Placa 2', this.transportation.vehiclePlate2 || ''],
        ['Placa 3', this.transportation.vehiclePlate3 || ''],
        ['Quantidade', this.batchOperation.sacksQuantity],
        ['Peso Líquido', this.batchOperation.netWeightString],
      ];
    }

  }

  buildForm() {
    this.form = this.formBuilder.group({
      'auditorId': [this.batchOperation.auditor ? this.batchOperation.auditor.id || '' : '' || ''],
      'operationTypeId': [this.batchOperation.operationType ? this.batchOperation.operationType.id || '' : '', [Validators.required]],
      'officialDate': [this.batchOperation.officialDate ? DateTimeHelper.toDDMMYYYY(this.batchOperation.officialDate) : ''],
      'note': [this.batchOperation.note || ''],
    });
  }

  handleError(error) {
    this.loading = false;
    return this.errorHandler.fromServer(error);
  }

  save() {
    Object.keys(this.form.controls).forEach((key) => {
      this.form.controls[key].markAsDirty();
    });

    if (!this.form.valid) {
      return;
    }

    this.batchOperation.auditor = this.users.find(u => u.id === this.form.value.auditorId);
    this.batchOperation.operationType = this.operationTypes.find(ot => ot.id === this.form.value.operationTypeId);
    this.batchOperation.note = this.form.value.note;
    this.batchOperation.officialDate = this.form.value.officialDate ? DateTimeHelper.fromDDMMYYYYHHmm(this.form.value.officialDate) : null;

    console.log('DATE');
    console.log('DATE',this.form.value.officialDate);

    this.loading = true;
    this.batchOperationService
      .updateComplement(this.batchOperation)
      .then((batchOperation: BatchOperation) => {
        this.batchOperation = batchOperation;
        this.loading = false;
        Notification.success('Romaneio salvo com sucesso!');

        this.reloadChildren = false;
        setTimeout(() => this.reloadChildren = true, 0);

      }).catch((error) => this.handleError(error));
  }

  close() {
    /**
     * Quando se tratar de operações de Entrada para o Processo (P_IN)
     * deve-se fazer a validação de pesos e se houver diferença,
     * deve-se apresentar uma mensagem de alerta com as opções Sim e Não.
     * Se for clicado em NÂO abandona a finalização do Lote e o usuário pode corrigir os valores,
     * se for clicado em SIM efetiva a finalização permitindo a diferença entre
     * o peso liquido dos lotes e a do romaneio.
     *
     * Se tem parâmetro para pudar validação, não a faz.
     */
    if (this.parameterService.skipValidationBatchOperationWeight() === false
      && this.batchOperation.type === BatchOperationType.P_IN.code) {

      // verifica se já foi confirmado
      if (this.confirmedDifferenceBatchWeight === false) {

        // o peso líquido do lote deve ser o mesmo da soma dos pesos líquidos dos batches
        let totalBatch: number = 0;

        if (this.batchOperation.batches != null && this.batchOperation.batches.length > 0) {
          this.batchOperation.batches.forEach(b => {
            totalBatch = totalBatch + b.netWeight;
          });
        }

        if (this.batchOperation.netWeight != totalBatch) {
          this.confirmDifferenceBatchWeightModal.open(null);
          return;
        }
      }
    }

    this.loading = true;
    this.batchOperationService
      .markInClosed(this.batchOperation)
      .then(() => {
        Notification.success('Entrada finalizada com sucesso!');
        this.loading = false;
        this.router.navigate(['/batch-operation']);
      }).catch(error => this.handleError(error));
  }

  refresh() {
    this.batchOperationService
      .find(this.batchOperation.id)
      .then((batchOperation) => {
        this.reloadChildren = false;
        setTimeout(() => this.reloadChildren = true, 0);
      });
  }

  reOpen() {
    this.loading = true;
    this.batchOperationService
      .reOpenBatchOperation(this.batchOperation.id)
      .then(() => {
        Notification.success('Romaneio reaberto com sucesso!');
        this.loading = false;
        location.reload();
      }).catch(error => this.handleError(error));
  }

  /**
   * Confirma que será a operação será fechada com pesos diferentes entre batches e romaneio.
   */
  confirmDifferenceBatchWeight() {
    this.confirmedDifferenceBatchWeight = true;
    this.close();
  }

  loadOperationTypeInfo() {
    return this.operationTypeService.list().then(operationTypes => {
      this.operationTypes = operationTypes;
      return this.parameterService.findByKey('OPERATION_TYPE')
    }).then((res) => {
      let filteredOperationTypes = this.operationTypes.filter((operationType) => {
        if(res) return operationType.description === res.value
      });
      this.operationTypeDefault = filteredOperationTypes.length > 0 ? filteredOperationTypes[0] : null;
      if (this.batchOperation.type === BatchOperationType.fromData('W_IN').code && !this.batchOperation.operationType) {
        this.batchOperation.operationType = this.operationTypeDefault;
      }
    }).catch(error => this.handleError(error));
  }
}
