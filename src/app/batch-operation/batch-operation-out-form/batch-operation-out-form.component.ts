import {MarkupGroupService} from '../../markup-group/markup-group.service';
import {Observable, Subscription} from 'rxjs/Rx';
import {ModalManager} from '../../shared/modals/modal-manager';
import {Component, OnInit, OnDestroy} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';

import {OperationTypeService} from '../../operation-type/operation-type.service';
import {ErrorHandler} from '../../shared/errors/error-handler';
import {Notification} from '../../shared/notification';
import {Transportation} from '../../transportation/transportation';
import {UserService} from '../../user/user.service';
import {BatchOperation} from '../batch-operation';
import {BatchOperationStatus} from '../batch-operation-status';
import {BatchOperationService} from '../batch-operation.service';
import {NumberHelper} from 'app/shared/globalization/number-helper';
import {ServiceChargeService} from "../../service-charge/service-charge.service";
import {ShippingAuthorizationType} from 'app/shipping-authorization/shipping-authorization-type';
import {Certificate} from "../../certificate/certificate";
import {KilosSacksConverterService} from "../../shared/kilos-sacks-converter/kilos-sacks-converter.service";
import {MarkupGroupBatch} from "../../markup-group/batch/markup-group-batch";
import {MarkupGroupBatchStatus} from "../../markup-group/batch/markup-group-batch-status";
import {OperationType} from "../../operation-type/operation-type";
import {User} from "../../user/user";
import {AuthService} from "../../auth/auth.service";
import {DateTimeHelper} from "../../shared/globalization";
import {Masks} from "../../shared/forms/masks/masks";
import {TransportationService} from "../../transportation/transportation.service";

@Component({
  selector: 'app-batch-operation-out-form',
  templateUrl: 'batch-operation-out-form.component.html'
})

export class BatchOperationOutFormComponent implements OnInit, OnDestroy {

  loading = false;
  batchOperation: BatchOperation;
  transportation: Transportation;
  dateMask = Masks.dateMask;
  form: FormGroup;
  showServiceChargeForm = false;
  closeConfirmModal = new ModalManager();
  alertModal = new ModalManager();
  alertModalMessage: string;
  closeBatchConfirm = new ModalManager();
  storageUnitOutNewModal = new ModalManager();
  storageUnitOutEditModal = new ModalManager();
  storageUnitOutDeleteModal = new ModalManager();
  markupGroupSubscription: Subscription;
  batchOperationCertificates: Array<Certificate>;
  markupGroupShippingAuthorization = null;
  automationRouteModal = new ModalManager();
  operationTypes: Array<OperationType>;
  parameterEnableButtonReabrir: boolean = false;

  get readOnly() {
    return this.batchOperation.status === BatchOperationStatus.CLOSED.code;
  }

  isClosed(batch: MarkupGroupBatch) {
    return batch.status === MarkupGroupBatchStatus.CLOSE.code
      && this.batchOperation.statusObject.code !== BatchOperationStatus.CLOSED.code
      && this.batchOperation.statusObject.code !== BatchOperationStatus.AUDITING.code;
  }

  get editing() {
    return !!this.batchOperation && !!this.batchOperation.id;
  }

  get markupGroup() {
    return this.batchOperation.markupGroup;
  }

  set markupGroup(value) {
    this.batchOperation.markupGroup = value;
  }

  constructor(private route: ActivatedRoute,
              private router: Router,
              private formBuilder: FormBuilder,
              private batchOperationService: BatchOperationService,
              private transportationService:TransportationService,
              private userService: UserService,
              private operationTypeService: OperationTypeService,
              private markupGroupService: MarkupGroupService,
              private authService: AuthService,
              private errorHandler: ErrorHandler,
              private serviceChargeService: ServiceChargeService,
              private kilosSacksConverterService: KilosSacksConverterService) {
  }

  ngOnInit() {
    Notification.clearErrors();

    this.route.data.forEach((data: { batchOperation: BatchOperation, transportation: Transportation }) => {
      this.transportation = data.transportation;
      this.batchOperation = data.batchOperation;

      this.loadMarkupGroup(true);
      this.markupGroupSubscription = Observable.timer(30 * 1000, 30 * 1000).subscribe(() => {
        this.loadMarkupGroup(false);
      });

    });

    this.buildForm();
    this.setOperations();

    this.serviceChargeService.hiddenChargesForEntry().then((parameter) => {
      this.showServiceChargeForm = !parameter;
    });

    this.parameterEnableButtonReabrir = this.authService.findParameterBoolean('ENABLE_BUTTON_REABRIR_ENTR_SAIDA');

    this.loading = false;
  }

  ngOnDestroy() {
    if (this.markupGroupSubscription != null && !this.markupGroupSubscription.closed) {
      this.markupGroupSubscription.unsubscribe();
    }
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

    this.batchOperation.operationType = this.operationTypes.find(ot => ot.id === this.form.value.operationTypeId);
    this.batchOperation.officialDate = this.form.value.officialDate ? DateTimeHelper.fromDDMMYYYY(this.form.value.officialDate) : null;

    this.loading = true;

    try {

      if( this.transportation.maxSacks !== this.form.value.maxWeight ){
        this.transportation.maxSacks = this.form.value.maxWeight;
        this.transportationService.save(this.transportation);
      }

    this.batchOperationService
      .updateComplement(this.batchOperation)
      .then((batchOperation: BatchOperation) => {
        this.batchOperation = batchOperation;
        this.loading = false;
        Notification.success('Romaneio salvo com sucesso!');
      });
    } catch (error) {
      this.handleError(error)
    }
  }

  setOperations() {
    this.operationTypeService.list().then(operationTypes => {
      this.operationTypes = operationTypes.filter(operationType => {
        return (operationType.type.match("[^ETC]"));
      });
    });
  }

  get infoLeft() {
    if (!this.batchOperation) {
      return [];
    }

    let nomeCliente = '';

    if (this.batchOperation.owner && this.batchOperation.owner.person)
      nomeCliente = this.batchOperation.owner.person.name;

    if (this.batchOperation.type === 'W_OUT') {
      nomeCliente = '';
      if (this.batchOperation.markupGroup) {
        nomeCliente = this.batchOperation.markupGroup.ownersBatchesNames;
      }
    }

    let receptaculoDeTransporte = '-';
    if (this.batchOperation.shippingData) {
      if (this.batchOperation.shippingData.packType) {
        receptaculoDeTransporte = this.batchOperation.shippingData.packType.description;
      }
    }

    return this.batchOperation.type === 'P_OUT' ?
      [
        ['Romaneio', this.batchOperation.batchOperationCode],
        ['Instrução de Serviço', this.batchOperation.serviceInstruction ? this.batchOperation.serviceInstruction.code : ''],
        ['Cliente', nomeCliente],
        ['Data', this.batchOperation.createdDateString],
      ]
      :
      [
        ['Embarque', this.batchOperation.batchOperationCode],
        ['Autorização de Embarque', this.batchOperation.shippingAuthorization.code],
        ['Cliente', nomeCliente],
        ['Data', this.batchOperation.createdDateString],
        ['Placa 1', this.transportation.vehiclePlate1],
        ['Placa 2', this.transportation.vehiclePlate2],
        ['Placa 3', this.transportation.vehiclePlate3],
        ['Receptáculo de Transporte', receptaculoDeTransporte],
      ];
  }


  buildForm() {
    this.form = this.formBuilder.group({
      'operationTypeId': [this.batchOperation.operationType ? this.batchOperation.operationType.id || '' : '', [Validators.required]],
      'officialDate': [this.batchOperation.officialDate ? DateTimeHelper.toDDMMYYYY(this.batchOperation.officialDate) : ''],
      'maxWeight': [this.transportation.maxSacks != null ? this.transportation.maxSacks : '']
    });
  }

  onStorageUnitModalClose() {
    this.storageUnitOutNewModal.close();
    this.storageUnitOutEditModal.close();
    this.storageUnitOutDeleteModal.close();
    this.loadMarkupGroup(true);
  }

  loadMarkupGroup(showLoading) {
    if (!this.markupGroup || !this.markupGroup.id) {
      return;
    }

    if (showLoading) {
      this.loading = true;
    }

    this.markupGroupService
      .find(this.markupGroup.id)
      .then((markupGroup) => {
        this.markupGroup = markupGroup;
        this.batchOperationCertificates = this.certificates;
        this.loading = false;
      });
    this.markupGroupService
      .find(this.batchOperation.shippingAuthorization.markupGroup.id)
      .then((markupGroup) => {
        this.markupGroupShippingAuthorization = markupGroup;
      });
  }

  get batches() {
    if (!this.markupGroup) {
      return [];
    }
    return this.markupGroup.batches;
  }

  getAuthorizedInfo(batchId) {
    let res = '-';
    if (this.markupGroupShippingAuthorization) {
      this.markupGroupShippingAuthorization.batches.map(i => {
        if (i.batch.id === batchId) {
          let firstPart = `${NumberHelper.toPTBR(i.quantityString)} (${i.sackQuantity} SC)`;
          let secondPart = `${NumberHelper.toPTBR(i.currentQuantityString)} (${this.kilosSacksConverterService.kilosToSacks(i.currentQuantity)} SC)`;
          res = `${firstPart} / ${secondPart}`;
        }
      });
    }
    return res;
  }

  hiddenFiscalNote() {
    let hidden = false;

    if (this.batchOperation && this.batchOperation.typeObject.code === 'P_OUT') {
      hidden = true;
      return hidden;
    }

    //Não deverá aparecer os dados de nota fiscal caso o tipo da autorização de embarque
    // não for de transferencia ou venda.
    hidden = this.batchOperation &&
    (this.batchOperation.shippingAuthorization.type === ShippingAuthorizationType.VENDA.code ||
      this.batchOperation.shippingAuthorization.type === ShippingAuthorizationType.TRANSFERENCIA.code) ? hidden : true;
    return hidden;
  }

  closeConfirm() {
    let tolerance = 60;
    let foundLess = false;
    let foundMore = false;
    this.markupGroup.batches.forEach(mgb => {
      if (mgb.quantity - mgb.currentQuantity >= tolerance)
        foundLess = true;
      if (mgb.currentQuantity - mgb.quantity >= tolerance)
        foundMore = true;
    });

    // if (foundLess) {
    //   Notification.error("O valor despejado é menor que o previsto!");
    // } else
    if (foundMore) {
      Notification.error("O valor despejado é maior que o previsto!");
    } else {
      this.closeConfirmModal.open(null);
    }

  }

  alertClose() {
    let value = this.alertModal.value;
    this.alertModal.close();
    if (value) {
      this.closeConfirmModal.open(null);
    }
  }

  close() {
    this.loading = true;

    this.batchOperationService
      .markOutClosed(this.batchOperation)
      .then(() => {
        Notification.success('Saída finalizada com sucesso!');
        this.loading = false;
        this.router.navigate(['/batch-operation']);
      }).catch(error => this.handleError(error));
  }

  get totalQuantity() {
    return this.batches.map(b => b.quantity).reduce((a, b) => a + b, 0);
  }

  get totalQuantityForAverageWeight() {
    return this.batches.map(b => +b.sackQuantity).reduce((a, b) => a + b, 0);
  }

  get totalQuantityString() {
    return NumberHelper.toPTBR(this.totalQuantity);
  }

  get totalCurrentQuantity() {
    return this.batches.map(b => b.currentQuantity).reduce((a, b) => a + b, 0);
  }

  get totalCurrentQuantityString() {
    return NumberHelper.toPTBR(this.totalCurrentQuantity);
  }

  get averagePerBag() {
    return NumberHelper.toPTBR(this.totalQuantity / this.totalQuantityForAverageWeight);
  }

  get totalQuantityShippingAuthorization() {
    if (!this.markupGroupShippingAuthorization || !this.markupGroupShippingAuthorization.batches) {
      return 0;
    }
    return this.markupGroupShippingAuthorization.batches.map(b => b.quantity).reduce((a, b) => a + b, 0);
  }

  get totalQuantityForAverageWeightShippingAuthorization() {
    if (!this.markupGroupShippingAuthorization || !this.markupGroupShippingAuthorization.batches) {
      return 0;
    }
    return this.markupGroupShippingAuthorization.batches.map(b => +b.sackQuantity).reduce((a, b) => a + b, 0);
  }

  get totalQuantityStringShippingAuthorization() {
    return NumberHelper.toPTBR(this.totalQuantityShippingAuthorization);
  }

  get totalCurrentQuantityShippingAuthorization() {
    if (!this.markupGroupShippingAuthorization || !this.markupGroupShippingAuthorization.batches) {
      return 0;
    }
    return this.markupGroupShippingAuthorization.batches.map(b => b.currentQuantity).reduce((a, b) => a + b, 0);
  }

  get totalCurrentQuantityStringShippingAuthorization() {
    return NumberHelper.toPTBR(this.totalCurrentQuantityShippingAuthorization);
  }

  get averagePerBagShippingAuthorization() {
    return NumberHelper.toPTBR(this.totalQuantityShippingAuthorization / this.totalQuantityForAverageWeightShippingAuthorization);
  }

  get certificates() {
    let mapCertificatesCount: Map<string, number> = new Map<string, number>();
    let mapCertificatesObj: Map<string, Certificate> = new Map<string, Certificate>();
    let certificatesValid: Array<Certificate> = new Array<Certificate>();
    for (var indexMgb in this.batches) {
      let markupGroupBatch = this.batches[indexMgb];
      let certificates = markupGroupBatch.batch.batchOperation.certificates;
      for (var indexCert in certificates) {
        let certificate: Certificate = certificates[indexCert];
        let cert: Certificate = mapCertificatesObj.get(certificate.name);
        if (cert == undefined) {
          mapCertificatesObj.set(certificate.name, certificate);
        }
        let countCert: number = mapCertificatesCount.get(certificate.name);
        if (countCert == undefined) {
          countCert = 0;
        }
        mapCertificatesCount.set(certificate.name, countCert + 1);
      }
    }
    let nrBatches: number = this.batches.length;
    mapCertificatesCount.forEach((value: number, key: string) => {

      if (value == nrBatches) {
        let cert: Certificate = mapCertificatesObj.get(key);
        certificatesValid.push(cert);
      }
    });

    return certificatesValid;
  }

  automationRouteModalCloseHandler() {
    this.automationRouteModal.close();
  }

  reopenMarkupGroup(batch: MarkupGroupBatch) {
    this.markupGroupService.reopenMarkupGroupBatch(batch.id)
      .then((response) => {
        try {
          this.loadMarkupGroup(true);
        }catch(e){
          console.log(e)
        }
        Notification.success('Despejo reaberto com sucesso!');
      }).catch(()=>{
        Notification.error('Não foi possível reabrir o despejo!');
    });

  }

  get enableButtonReabrir() {

    let enable = false;

    if (this.batchOperation != null && this.batchOperation.status != null
      && (this.batchOperation.status === BatchOperationStatus.CLOSED.code
        // || this.batchOperation.status === BatchOperationStatus.AUDITING.code
        || this.batchOperation.status === BatchOperationStatus.STORED.code
      )) {
      enable = true;
    }
    else {
      return false;
    }

    return enable && !!this.authService.accessToken.leader && !!this.parameterEnableButtonReabrir;
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

}
