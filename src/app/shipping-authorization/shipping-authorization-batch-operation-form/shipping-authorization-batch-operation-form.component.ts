import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthService } from '../../auth/auth.service';
import { BatchOperationService } from '../../batch-operation/batch-operation.service';
import { ModalManager } from '../../shared/modals/modal-manager';
import { Transportation } from '../../transportation/transportation';
import { ErrorHandler } from '../../shared/errors/error-handler';
import { Notification } from '../../shared/notification';
import { OperationType } from 'app/operation-type/operation-type';
import { OperationTypeService } from 'app/operation-type/operation-type.service';
import { ShippingData } from 'app/shipping-data/shipping-data';
import { PackType } from 'app/pack-type/pack-type';
import { PackTypeService } from 'app/pack-type/pack-type.service';
import { ParameterService } from '../../parameter/parameter.service';
import {TransportationService} from "../../transportation/transportation.service";

@Component({
  selector: 'app-shipping-authorization-batch-operation-form',
  templateUrl: './shipping-authorization-batch-operation-form.component.html'
})
export class ShippingAuthorizationBatchOperationFormComponent implements OnInit {
  transportation: Transportation;
  form: FormGroup;
  loading: boolean = false;
  submitted = false;
  destroyConfirm = new ModalManager();
  origin: 'balance' | 'shipping-authorization' = 'shipping-authorization';
  operations: Array<OperationType>;
  packTypes: Array<PackType>;
  calculationMode: string;
  maxSacksLabel: string;


  get editing() {
    return !!this.markupGroup
      || this.markupGroup.id;
  }

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

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private errorHandler: ErrorHandler,
    private auth: AuthService,
    private batchOperationService: BatchOperationService,
    private transportationService: TransportationService,
    private operationTypeService: OperationTypeService,
    private packTypeService: PackTypeService,
    private parameterService: ParameterService
  ) { }

  ngOnInit() {
    Notification.clearErrors();

    this.origin = this.route.snapshot.queryParams['origin'] || 'shipping-authorization';

    this.route.data.forEach((data: { transportation: Transportation }) => {
      this.transportation = data.transportation;
      if (this.transportation.batchOperationOut.shippingData == null) {
        this.transportation.batchOperationOut.shippingData = new ShippingData();
      }
      if(this.transportation.batchOperationOut.shippingData.packTypes == null){
        this.transportation.batchOperationOut.shippingData.packTypes = [];
      }
      this.loading = true;

      Promise.all([
        this.packTypeService.listByGenericType('R'),
        this.operationTypeService.list()
      ]).then(responses => {
        this.packTypes = <any>responses[0];
        this.operations = <any>responses[1];
        this.loading = false;
        this.buildForm();
      })
        .catch(error => {
          this.buildForm();
          this.handleError(error);
        });

    });

    this.parameterService.findByKey('BATCH_OPERATION_QUANTITY_CALCULATION_MODE').then( res => {
      this.calculationMode = res.value;
      this.maxSacksLabel = this.calculationMode === 'NF' ? 'Quantidade de Sacas' : 'Quantidade';
    });
  }

  buildForm() {
    // se não existe shipping_data é novo registro
    if (this.transportation.batchOperationOut.shippingData == null) {
      this.transportation.batchOperationOut.shippingData = new ShippingData()
    }

    this.form = this.formBuilder.group({
      'markupGroupColor': [this.markupGroup.color || '#0000B2', [Validators.required]],
      'operationType': [(this.transportation.batchOperationOut.operationType != null)
        ? this.transportation.batchOperationOut.operationType.id : '' , Validators.required],
      'oicCode': [this.transportation.batchOperationOut.shippingData.oicCode || ''],
      'containerNumber': [this.transportation.batchOperationOut.shippingData.containerNumber || ''],
      'saleReference': [this.transportation.batchOperationOut.shippingData.saleReference || ''],
      'destiny': [this.transportation.batchOperationOut.shippingData.destiny || this.shippingAuthorization.destinationWarehouse.name || ''],
      'observation': [this.transportation.batchOperationOut.shippingData.observation || this.shippingAuthorization.observation || ''],
      'packTypeId': [(this.transportation.batchOperationOut.shippingData.packType != null)
        ? this.transportation.batchOperationOut.shippingData.packType.id : ''],
      'maxSacks': [(this.transportation.maxSacks != null) ? this.transportation.maxSacks : ''],
      'granelDesligado': [this.transportation.maxSacks != null]
    });
  }


  onChangeGranel() {
    let granelDesligadoInput = this.form.get('granelDesligado').value;
    let maxSacksInput = this.form.get('maxSacks')
    granelDesligadoInput ? maxSacksInput.enable() : maxSacksInput.disable();
  }

  get backRoute() {
    if (this.origin === 'balance') {
      return `/balance/out/${this.transportation.id}`;
    }

    return '/shipping-authorization';
  }

  destroy() {
    this.loading = true;

    this.batchOperationService
      .deleteMarkupGroup(this.transportation.batchOperationOut)
      .then(() => {
        this.loading = false;
        Notification.success('Embarque desvinculado com sucesso!');
        this.router.navigate([this.backRoute]);
      }).catch(error => this.handleError(error));
  }

  save() {
    this.submitted = true;

    Object.keys(this.form.controls).forEach((key) => {
      this.form.controls[key].markAsDirty();
    });

    if (!this.form.valid) {
      return;
    }

    const emptyBatches = !this.transportation.batchOperationOut.markupGroup.batches || !this.transportation.batchOperationOut.markupGroup.batches.length;

    if (emptyBatches) {
      return;
    }

    this.markupGroup.color = this.form.value.markupGroupColor;
    this.transportation.batchOperationOut.operationType = this.getOperations().find(o => o.id === this.form.value.operationType);

    this.transportation.batchOperationOut.shippingData.oicCode = this.form.value.oicCode;
    this.transportation.batchOperationOut.shippingData.containerNumber = this.form.value.containerNumber;
    this.transportation.batchOperationOut.shippingData.saleReference = this.form.value.saleReference;
    this.transportation.batchOperationOut.shippingData.destiny = this.form.value.destiny;
    this.transportation.batchOperationOut.shippingData.observation = this.form.value.observation;

    let packTypeId = this.form.value.packTypeId;
    this.transportation.batchOperationOut.shippingData.packType = (packTypeId) ? this.packTypes.find(p => p.id === packTypeId) : null;

    this.loading = true;


    if(this.transportation && this.transportation.batchOperationOut && this.transportation.batchOperationOut.markupGroup)
    {
      for (let bgb of this.transportation.batchOperationOut.markupGroup.batches) {
        bgb.markupGroupBatchParent = null;
      }
    }

    if(this.form.value.granelDesligado && this.form.value.maxSacks !== this.transportation.maxSacks){
      this.transportation.maxSacks = this.form.value.maxSacks;

      let tempBatches = this.transportation.batchOperationOut.markupGroup.batches;
      let totalWeight = tempBatches.map( b => b.quantity ).reduce( (q1, q2) => q1 + q2 );

      let totalSacks = tempBatches.map( b => b.sackQuantity ).reduce( (q1, q2) => q1 + q2);
      // maxWeight é o peso médio das sacas para esta autorização de embarque.
      this.transportation.maxWeight = (totalWeight/totalSacks);

      this.transportationService.save(this.transportation).catch(err=>this.errorHandler.fromServer(err));
    } else if (!this.form.value.granelDesligado && this.transportation.maxSacks){
      this.transportation.maxSacks = null;
      this.transportationService.save(this.transportation).catch(err=>this.errorHandler.fromServer(err));
    }

    return this.batchOperationService.saveMarkupGroup(this.transportation.batchOperationOut)
      .then(() => {
        Notification.success('Embarque salvo com sucesso!');
        this.router.navigate([this.backRoute]);
      })
      .catch((error) => this.handleError(error));
  }

  handleError(error) {
    this.loading = false;
    return this.errorHandler.fromServer(error);
  }

  /**
   * Lista de operações
   *
   * O campo deve ser apresentado em componente do tipo lista e deve apresentar as ocorrências
   * gravadas na tabela OPERATION_TYPE que possuam o campo type com valor diferente de
   * “E” (Entrada), “T“ (Transferência) ou “C” (Compra de Café).
   */
  getOperations(): Array<OperationType> {

    let list = Array<OperationType>();

    if (this.operations != null && this.operations.length > 0) {
      this.operations.forEach(ope => {
        if (ope.type != 'E' && ope.type != 'T' && ope.type != 'C') {
          list.push(ope);
        }
      });
    }

    return list;
  }

  getPackTypes(): Array<PackType> {
    return this.packTypes;
  }

}
