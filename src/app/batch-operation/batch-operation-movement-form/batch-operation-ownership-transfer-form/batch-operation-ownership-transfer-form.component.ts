import { Subscription } from 'rxjs/Rx';
import { Masks } from '../../../shared/forms/masks/masks';
import { ErrorHandler } from '../../../shared/errors/error-handler';
import { Component, OnInit, OnDestroy, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BatchOperationOwnershipTransfer } from './batch-operation-ownership-transfer';
import { WarehouseService } from '../../../warehouse/warehouse.service';
import { BatchService } from '../../../batch/batch.service';
import { Warehouse } from '../../../warehouse/warehouse';
import { Batch } from '../../../batch/batch';
import { Notification } from '../../../shared/notification';

import { WarehouseStakeholderAutocomplete } from '../../../warehouse-stakeholder/warehouse-stakeholder-autocomplete';
import { WarehouseStakeholderService } from '../../../warehouse-stakeholder/warehouse-stakeholder.service';
import { BatchOperationService } from "../../batch-operation.service";
import { AuthService } from "../../../auth/auth.service";
import { KilosSacksConverterService } from "../../../shared/kilos-sacks-converter/kilos-sacks-converter.service";
import { FiscalNote } from "../../../fiscal-note/fiscal-note";
import { BatchTransfer } from "../batch-list-ownership-transfer-form/batch-transfer";
import {PurchaseOrder} from "../../../purchase-order/purchase-order";
import {PurchaseOrderService} from "../../../purchase-order/purchase-order.service";
import {ParameterService} from "../../../parameter/parameter.service";
import {DateTimeHelper} from "../../../shared/globalization";

@Component({
  selector: 'app-batch-operation-ownership-transfer-form',
  templateUrl: './batch-operation-ownership-transfer-form.component.html'
})
export class BatchOperationOwnershipTransferFormComponent implements OnInit, OnDestroy {

  form: FormGroup;
  loading: boolean = false;
  integerMask = Masks.integerMask;
  decimalMask = Masks.decimalMask;
  dateMask = Masks.dateMask;

  batchOperationOwnershipTransfer: BatchOperationOwnershipTransfer;
  warehouses: Array<Warehouse> = [];
  batches: Array<Batch> = [];
  ownerAutocomplete: WarehouseStakeholderAutocomplete;
  ownerSubscription: Subscription;
  ownerStakeholderId: String;
  recipientAutocomplete: WarehouseStakeholderAutocomplete;
  recipientSubscription: Subscription;
  personDocumentRegistration: String;
  collaboratorRegistration: String;
  warehouse: Warehouse;
  batchOriginSelected: Batch;
  batchsTransfer: BatchTransfer[] = [];
  fiscalNotes: FiscalNote[] = [];
  batchsOperationOwnershipTransfer: BatchOperationOwnershipTransfer[] = [];
  ownerIdChange: EventEmitter<any> = new EventEmitter<any>();
  ownerIdChangeSubscription: Subscription;
  purchaseOrders: Array<PurchaseOrder> = [];
  // para exibir ou não a ordem de compra
  showPurchaseOrder: boolean = false;
  // para verificar se está fazendo requisição para recuperar ordem de compras
  isRequestingPurchaseOrders = false;
  purchaseOrder: PurchaseOrder;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private warehouseService: WarehouseService,
    private warehouseStakeholderService: WarehouseStakeholderService,
    private batchService: BatchService,
    private batchOperationService: BatchOperationService,
    private auth: AuthService,
    private kilosSacksConverterService: KilosSacksConverterService,
    private purchaseOrderService: PurchaseOrderService,
    private parameterService: ParameterService,
    private errorHandler: ErrorHandler,
  ) { }

  ngOnInit() {

    Notification.clearErrors();
    this.batchOriginSelected = null;

    this.warehouseService.list().then(warehouses => {
      this.warehouses = warehouses;
    }).catch(error => this.handleError(error));

    this.warehouse = this.auth.accessToken.warehouse;
    this.ownerStakeholderId = '';
    this.ownerIdChange.emit(this.ownerStakeholderId);
    this.route.data.forEach(() => {
      this.ownerAutocomplete = new WarehouseStakeholderAutocomplete(
        this.warehouseStakeholderService,
        this.errorHandler
      );

      this.recipientAutocomplete = new WarehouseStakeholderAutocomplete(
        this.warehouseStakeholderService,
        this.errorHandler
      );

      this.buildForm();
    });

    this.showPurchaseOrder = this.parameterService.purchaseOrderScreenDefault();
  }

  ngOnDestroy() {
    if (this.ownerSubscription != null && !this.ownerSubscription.closed) {
      this.ownerSubscription.unsubscribe();
    }

    if (this.recipientSubscription != null && !this.recipientSubscription.closed) {
      this.recipientSubscription.unsubscribe();
    }

    if (this.ownerIdChangeSubscription != null && !this.ownerIdChangeSubscription.closed) {
      this.ownerIdChangeSubscription.unsubscribe();
    }
  }

  buildForm() {

    this.form = this.formBuilder.group({
      'warehouse': ['', Validators.required],
      'ownerStakeholderId': ['', Validators.required],
      'recipientStakeholderId': ['', Validators.required],
      'purchaseOrderId': [''],
      'sellCode': ['', Validators.required],
      'observation': [''],
      'officialDate': [''],
      'surplusTransfer': [false, Validators.required]
    });

    this.ownerAutocomplete.value = null;
    this.recipientAutocomplete.value = null;
    this.personDocumentRegistration = null;
    this.collaboratorRegistration = null;
    this.form.get('warehouse').setValue(this.warehouse.code + ' - ' + this.warehouse.name);
    this.refreshBatchesOrigin();

    this.ownerSubscription = this.ownerAutocomplete.valueChange.subscribe((value) => {
      const id = value ? value.id : null;
      this.form.get('ownerStakeholderId').setValue(id);
      this.ownerStakeholderId = id;
      this.ownerIdChange.emit(this.ownerStakeholderId);
    });

    this.recipientSubscription = this.recipientAutocomplete.valueChange.subscribe((value) => {
      const id = value ? value.id : null;
      const personDocumentRegistration = value ? value.person.document : null;
      const collaboratorRegistration = value ? value.collaboratorRegistration : null;

      this.form.get('recipientStakeholderId').setValue(id);
      this.personDocumentRegistration = personDocumentRegistration;
      this.collaboratorRegistration = collaboratorRegistration;
      this.getPurchaseOrdersByStakeholder(value && value.id);
    });

    this.ownerIdChangeSubscription = this.ownerIdChange.subscribe((value) => {
      this.batchService.ownerId = value;
    });
  }

  save() {
    this.batchsOperationOwnershipTransfer = [];
    Object.keys(this.form.controls).forEach((key) => {
      this.form.controls[key].markAsDirty();
    });

    if (!this.form.valid) {
      return;
    }

    let purchaseOrderSelected = this.purchaseOrders.find(p => p.id === this.form.value.purchaseOrderId);
    for (var index in this.batchsTransfer) {
      let batchTransfer = this.batchsTransfer[index];

      this.batchOperationOwnershipTransfer = new BatchOperationOwnershipTransfer();
      this.batchOperationOwnershipTransfer.warehouse = this.warehouse.code;
      this.batchOperationOwnershipTransfer.batchOrigin = batchTransfer.batchOrigin.batchCode;
      this.batchOperationOwnershipTransfer.batchDestiny = batchTransfer.batchDestinyCode;
      if (this.personDocumentRegistration) {
        this.batchOperationOwnershipTransfer.personDocumentRegistration = this.personDocumentRegistration;
      }
      if (this.collaboratorRegistration) {
        this.batchOperationOwnershipTransfer.collaboratorRegistration = this.collaboratorRegistration.trim();
      }
      this.batchOperationOwnershipTransfer.quantityTransfer = batchTransfer.quantityTransfer + "";
      this.batchOperationOwnershipTransfer.quantityBags = batchTransfer.quantityBags + "";
      this.batchOperationOwnershipTransfer.surplusTransfer = this.form.value.surplusTransfer;
      this.batchOperationOwnershipTransfer.cancelTransfer = false;
      for (var indexFiscal in this.fiscalNotes) {
        let fiscalNote = this.fiscalNotes[indexFiscal];
        fiscalNote.purchaseOrder = purchaseOrderSelected;
      }
      this.batchOperationOwnershipTransfer.fiscalNotes = this.fiscalNotes;
      this.batchOperationOwnershipTransfer.sellCode = this.form.value.sellCode;
      this.batchOperationOwnershipTransfer.note = this.form.value.observation;
      this.batchOperationOwnershipTransfer.officialDate = this.form.value.officialDate ? DateTimeHelper.fromDDMMYYYY(this.form.value.officialDate) : null;
      this.batchOperationOwnershipTransfer.calcManual = batchTransfer.calcManual;
      this.batchOperationOwnershipTransfer.refClient = batchTransfer.refClient;

      this.batchsOperationOwnershipTransfer.push(this.batchOperationOwnershipTransfer);
    }

    this.loading = true;
    this.batchOperationService.ownershipTransferByList(this.batchsOperationOwnershipTransfer)
      .then((result: any) => {
        this.loading = false;
        if (result.errorMsg && result.errorMsg != '') {
          Notification.error(result.errorMsg);
        }
        else {
          Notification.success('Transferência de titularidade salva com sucesso!');
          this.router.navigate(['/batch-operation']);
        }
      }).catch((error) => this.handleError(error));
  }

  handleError(error) {
    this.loading = false;
    return this.errorHandler.fromServer(error);
  }

  kilosToSacks() {
    let sacks: number = this.kilosSacksConverterService.kilosToSacks(this.form.value.quantityTransfer, this.batchOriginSelected);
    this.form.get('quantityBags').setValue(sacks);
  }

  refreshBatchesOrigin() {
    this.batches = [];
    this.batchService.findByWarehouse(this.warehouse.id).then(batches => {
      this.batches = batches;
    }).catch(error => this.handleError(error));
  }

  /**
   * Remove item de lista
   *
   * @param tempId
   */
  removeBatchTransfer(tempId:string) {

    // let indexToRemove = -1;
    // if (tempId && this.batchsTransfer) {
    //
    //   for (let i = 0; i < this.batchsTransfer.length; i++) {
    //     if (this.batchsTransfer[i].tempId === tempId) {
    //       indexToRemove = i;
    //       break;
    //     }
    //   }
    // }
    //
    // if (indexToRemove > -1) {
    //   this.batchsTransfer.splice(indexToRemove, 1);
    // }
    if(tempId && this.batchsTransfer){
      this.batchsTransfer = this.batchsTransfer.filter(item=> item.tempId !== tempId);
    }
  }

  /**
   * Busca ordens de compra pelo stakeholder Depositante, se o tela requer a exibição.
   */
  getPurchaseOrdersByStakeholder(stakeholderId: string) {

    if (this.showPurchaseOrder) {

      // limpa lista quando não há stakeholder especificado ou ocorreu erro na busca
      if (stakeholderId != null && stakeholderId != '') {

        // para evitar fazer multiplas consultas
        if (this.isRequestingPurchaseOrders == false) {

          this.isRequestingPurchaseOrders = true;

          this.purchaseOrderService.listNotDischarged(stakeholderId).then(list => {
            this.purchaseOrders = list;
            this.isRequestingPurchaseOrders = false;
          }).catch(error => {
            this.purchaseOrders = [];
            this.isRequestingPurchaseOrders = false;
            console.error(error);
          });
        }

      }
      else {
        this.purchaseOrders = [];
      }
    }
  }
}
