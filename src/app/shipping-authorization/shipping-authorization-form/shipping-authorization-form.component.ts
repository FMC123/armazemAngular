import { AuthService } from '../../auth/auth.service';
import { ShippingAuthorizationType } from '../shipping-authorization-type';
import { WarehouseService } from '../../warehouse/warehouse.service';
import { Warehouse } from '../../warehouse/warehouse';
import { MarkupGroupType } from '../../markup-group/markup-group-type';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/Rx';

import { Masks } from '../../shared/forms/masks/masks';
import { WarehouseStakeholder } from '../../warehouse-stakeholder/warehouse-stakeholder';
import { WarehouseStakeholderService } from '../../warehouse-stakeholder/warehouse-stakeholder.service';
import { ErrorHandler } from '../../shared/errors/error-handler';
import { Notification } from '../../shared/notification';
import { ShippingAuthorization } from '../shipping-authorization';
import { ShippingAuthorizationService } from '../shipping-authorization.service';
import { Parameter } from 'app/parameter/parameter';
import { ParameterService } from 'app/parameter/parameter.service';
import { WarehouseStakeholderAutocomplete } from 'app/warehouse-stakeholder/warehouse-stakeholder-autocomplete';
import { ModalManager } from "../../shared/shared.module";
import {BatchAutocomplete} from "../../batch/batch-autocomplete";
import {BatchService} from "../../batch/batch.service";
import {RetentionService} from "../../warrant-control/retention.service";

@Component({
  selector: 'app-shipping-authorization-form',
  templateUrl: './shipping-authorization-form.component.html'
})
export class ShippingAuthorizationFormComponent implements OnInit {
  shippingAuthorization: ShippingAuthorization;
  form: FormGroup;
  loading: boolean = false;
  dateMask = Masks.dateMask;
  warehouses: Array<Warehouse> = [];
  submitted = false;
  types = Array<ShippingAuthorizationType>();
  parameterBatchDifferent: Parameter = null;

  ownerAutocomplete: WarehouseStakeholderAutocomplete;
  ownerSubscription: Subscription;
  typeSubscription: Subscription;

  destinataryAutocomplete: WarehouseStakeholderAutocomplete;
  destinatarySubscription: Subscription;

  batchAutocomplete: BatchAutocomplete;

  // cofirmação para validação de certificados
  confirmedCertificateValidation: boolean = false;
  confirmCertificateValidation: ModalManager = new ModalManager();

  get editing() {
    return !!this.shippingAuthorization && !!this.shippingAuthorization.id;
  }

  get saleEditing() {
    return this.editing && this.shippingAuthorization.isVenda;
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private shippingAuthorizationService: ShippingAuthorizationService,
    private warehouseService: WarehouseService,
    private errorHandler: ErrorHandler,
    private auth: AuthService,
    private parameterService: ParameterService,
    private warehouseStakeholderService: WarehouseStakeholderService,
    private batchService: BatchService,
    private retentionService: RetentionService
  ) { }

  ngOnInit() {
    Notification.clearErrors();

    this.ownerAutocomplete = new WarehouseStakeholderAutocomplete(this.warehouseStakeholderService, this.errorHandler);
    this.destinataryAutocomplete = new WarehouseStakeholderAutocomplete(this.warehouseStakeholderService, this.errorHandler);
    this.batchAutocomplete = new BatchAutocomplete(this.batchService, this.errorHandler);

    this.route.data.forEach((data: { shippingAuthorization: ShippingAuthorization }) => {
      this.shippingAuthorization = data.shippingAuthorization;

      this.warehouseService.list().then(warehouses => {
        this.warehouses = warehouses;

        // verifica parâmetro, para poder selecionar bathces de diferentes clientes
        this.parameterService.findByKey('BATCH_DIFFERENT_CUSTOMER_CAN_MIX').then(parameter => {
          this.parameterBatchDifferent = parameter;
          this.buildForm();
        }).catch(error => {
          this.buildForm();
        });

      }).catch(error => {
        this.buildForm();
        this.handleError(error);
      });
    });

    this.types = ShippingAuthorizationType.list();
  }

  ngOnDestroy() {

    if (this.ownerSubscription && !this.ownerSubscription.closed) {
      this.ownerSubscription.unsubscribe();
    }

    if (this.destinatarySubscription && !this.destinatarySubscription.closed) {
      this.destinatarySubscription.unsubscribe();
    }

    if (this.typeSubscription && !this.typeSubscription.closed) {
      this.typeSubscription.unsubscribe();
    }
  }

  buildForm() {

    // seleciona Warehouse Matriz como padrão quando nenhum for informado
    if (this.shippingAuthorization.destinationWarehouse == null
      || this.shippingAuthorization.destinationWarehouse.id == null) {

      if (this.destinationWarehouses != null && this.destinationWarehouses.length > 0) {

        for (let w of this.destinationWarehouses) {
          if (w.matriz) {
            this.shippingAuthorization.destinationWarehouse = w;
            break;
          }
        }
      }
    }

    this.form = this.formBuilder.group({
      'destinationWarehouseId': [this.shippingAuthorization.destinationWarehouse ? this.shippingAuthorization.destinationWarehouse.id || '' : '', []],
      'expectedDateString': [this.shippingAuthorization.expectedDateString || '', [Validators.required]],
      'markupGroupColor': [this.shippingAuthorization.markupGroup.color || '#FFCC33', [Validators.required]],
      'type': [this.shippingAuthorization.type || '', [Validators.required]],
      'clientId': ['', []],
      'destinataryId': [this.shippingAuthorization.destinatary
        ? this.shippingAuthorization.destinatary.id || '' : '', []],
        'observation': [this.shippingAuthorization.observation
          ? this.shippingAuthorization.observation || '' : '', []],
    });


    // quando é do tipo transferência o armazem é obrigatório
    this.typeSubscription = this.form.get('type').valueChanges.subscribe((type) => {

      if (type != ShippingAuthorizationType.TRANSFERENCIA.code) {
        this.form.controls["destinationWarehouseId"].setValidators(null);
        this.form.controls["destinationWarehouseId"].updateValueAndValidity();
      } else {
        this.form.controls["destinationWarehouseId"].setValidators(Validators.required);
        this.form.controls["destinationWarehouseId"].updateValueAndValidity();
      }
      if(type === ShippingAuthorizationType.TRANSFERENCIA.code || type === ShippingAuthorizationType.VENDA.code) {
        this.form.controls["destinataryId"].setValidators(Validators.required);
        this.form.controls["destinataryId"].updateValueAndValidity();
      }
      else {
        this.form.controls["destinataryId"].setValidators(null);
        this.form.controls["destinataryId"].updateValueAndValidity();
      }
    });

    if (this.shippingAuthorization.type != ShippingAuthorizationType.TRANSFERENCIA.code) {
      this.form.controls["destinationWarehouseId"].setValidators(null);
      this.form.controls["destinationWarehouseId"].updateValueAndValidity();
    } else {
      this.form.controls["destinationWarehouseId"].setValidators(Validators.required);
      this.form.controls["destinationWarehouseId"].updateValueAndValidity();
    }

    // quando for edição e não pode selecionar vários lotes, precisa mostrar o cliente que foi selecionado,
    // através do cliente de um dos batches
    if (this.podeSelecionarLotesDiferentesClientes() == false && this.shippingAuthorization != null &&
      this.shippingAuthorization.batches != null && this.shippingAuthorization.batches.length > 0) {

      if (this.shippingAuthorization.batches[0].batch != null &&
        this.shippingAuthorization.batches[0].batch.batchOperation != null &&
        this.shippingAuthorization.batches[0].batch.batchOperation.owner != null) {

        this.ownerAutocomplete.value = WarehouseStakeholder.fromData(this.shippingAuthorization.batches[0].batch.batchOperation.owner);
        this.form.get('clientId').setValue(this.shippingAuthorization.batches[0].batch.batchOperation.owner.id);
      }
    }

    if (this.shippingAuthorization.destinatary != null) {
      this.destinataryAutocomplete.value = this.shippingAuthorization.destinatary;
    }

    // quando não tem permissão para selecionar lotes de vários clientes, precisa selecionar um
    if (this.podeSelecionarLotesDiferentesClientes() == false) {
      this.form.controls["clientId"].setValidators(Validators.required);
      this.form.controls["clientId"].updateValueAndValidity();
    }
    else {
      this.form.controls["clientId"].setValidators(null);
      this.form.controls["clientId"].updateValueAndValidity();
    }

    // na alteração do cliente
    this.ownerSubscription = this.ownerAutocomplete.valueChange.subscribe((value) => {
      const id = value ? value.id : null;
      this.form.get('clientId').setValue(id);
      if(id){
        this.retentionService.getRetentionSumNoBatch(id).then((retentionSum) => {
          if(retentionSum)
            this.retentionService.retentionSum = retentionSum;
          else
            this.retentionService.retentionSum = 0;
         });
      }
      // quando troca o cliente, precisa limpar os batches selecionados, se não aceita vários clientes diferentes
      if (this.podeSelecionarLotesDiferentesClientes() == false) {
        this.shippingAuthorization.batches = [];
      }
    });

    // na alteração do destinatário
    this.destinatarySubscription = this.destinataryAutocomplete.valueChange.subscribe((value) => {
      const id = value ? value.id : null;
      this.form.get('destinataryId').setValue(id);
    });
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

  get destinationWarehouses() {
    return this.warehouses.filter(w => w.id !== this.auth.accessToken.warehouse.id);
  }

  /**
   * Para mostrar ou não a seleção de lotes, pois quando estiver configurado para não permitir lotes de vários clientes,
   * o mesmo deve ser selecionado.
   */
  showBatchesSelection() {
    return (this.podeSelecionarLotesDiferentesClientes() == true
      || (this.form.get('clientId').value != null && this.form.get('clientId').value != ''));
  }

  save() {
    this.submitted = true;

    Object.keys(this.form.controls).forEach((key) => {
      this.form.controls[key].markAsDirty();
    });

    if (!this.form.valid) {
      return;
    }

    const emptyBatches = !this.shippingAuthorization.batches || !this.shippingAuthorization.batches.length;

    if (emptyBatches) {
      return;
    }

    const totalBatchWeight = this.shippingAuthorization.batches?
      this.shippingAuthorization.batches.map(item=>item.quantity || 0).reduce((a,b)=> a+b,0): 0;

    let retentionSumbatch;

    this.retentionService.getRetentionSumNoBatch(this.form.get('clientId').value).then(response => {
      retentionSumbatch = response;
    })

    if(retentionSumbatch && totalBatchWeight > retentionSumbatch){
      Notification.error("O total selecionado não pode passar o valor disponível delimitado pelas Apólices de Seguro");
      return;
    }

    // verifica se precisa confirmar os lotes com certificados
    if (this.needConfirmCertificateValidation()) {
      this.loading = false;
      this.confirmCertificateValidation.open(null);
      return;
    }

    this.loading = true;

    this.shippingAuthorization.type = this.form.value.type;
    this.shippingAuthorization.destinationWarehouse = this.warehouses.find(s => s.id === this.form.value.destinationWarehouseId);
    this.shippingAuthorization.expectedDateString = this.form.value.expectedDateString;
    this.shippingAuthorization.markupGroup.color = this.form.value.markupGroupColor;
    this.shippingAuthorization.observation = this.form.value.observation;
    this.shippingAuthorization.markupGroup.type = MarkupGroupType.SHIPPING_AUTHORIZATION.code;
    this.shippingAuthorization.destinatary = this.destinataryAutocomplete.value;

/*    this.shippingAuthorization.markupGroup.batches.forEach((mgb)=>{
      mgb.weightSack = mgb.sackQuantity;
    });*/

    return this.shippingAuthorizationService.save(this.shippingAuthorization).then((res) => {
      Notification.success('Autorização de embarque salva com sucesso!');
      this.router.navigate(['/shipping-authorization']);
    }).catch((error) => this.handleError(error));
  }

  handleError(error) {
    this.loading = false;
    return this.errorHandler.fromServer(error);
  }

  /**
     * Verifica a necessidade de confirmação da validação  dos certificados
     */
  needConfirmCertificateValidation(): boolean {
    /**
     * Ao salvar a autorização de Embarque, verificar se existem lotes de cafés certificado misturado com  lotes de café não certificados.
     * Se houver dar mensagem de alerta "Neste embarque estão sendo misturados café certificado e não certificado. Deseja continuar?  (S/N)".
     * Caso seja selecionada a opção NÃO o salvamento da tela deve ser abandonado, permitindo que o usuário refaça a seleção de lotes.
     * Caso seja selecionada a opção SIM a autorização de embarque deve ser salva com a mistura de cafés certificados e não certificados.
     */
    if (this.confirmedCertificateValidation == false) {

      let haveAnyBatchCertificate: boolean = false;
      let haveAnyBatchNotCertificate: boolean = false;

      this.shippingAuthorization.markupGroup.batches.forEach(markupGroupBatch => {

        if (markupGroupBatch.batch != null && markupGroupBatch.batch.batchOperation != null) {

          if (markupGroupBatch.batch.batchOperation.certificates != null
            && markupGroupBatch.batch.batchOperation.certificates.length > 0) {
            haveAnyBatchCertificate = true;
          }
          else {
            haveAnyBatchNotCertificate = true;
          }
        }
      });

      if (haveAnyBatchCertificate && haveAnyBatchNotCertificate) {
        return true;
      }
    }

    return false;
  }

  /**
   * Confirmação da validação dos certificados pelo usário
   */
  setConfirmCertificateValidation() {
    this.confirmedCertificateValidation = true;
    this.save();
  }
}
