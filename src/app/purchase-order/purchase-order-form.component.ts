import { Masks } from 'app/shared/forms/masks/masks';
import { ErrorHandler } from 'app/shared/errors/error-handler';
import { Notification } from 'app/shared/notification/notification';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Warehouse } from 'app/warehouse/warehouse';
import { WarehouseStakeholderService } from "app/warehouse-stakeholder/warehouse-stakeholder.service";
import { ModalManager } from "app/shared/shared.module";
import { PurchaseOrder } from './purchase-order';
import { PurchaseOrderService } from './purchase-order.service';
import { PackType } from 'app/pack-type/pack-type';
import { PurchaseOrderStatus } from './purchase-order-status';
import { WarehouseStakeholderAutocomplete } from 'app/warehouse-stakeholder/warehouse-stakeholder-autocomplete';
import { Subscription } from 'rxjs';
import { PackTypeService } from 'app/pack-type/pack-type.service';
import { AuthService } from 'app/auth/auth.service';
import { CityAutocomplete } from 'app/city/city-autocomplete';
import { CityService } from 'app/city/city.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ServiceInstructionStatus } from 'app/service-instruction/service-instruction-status';
import { BalanceService } from 'app/balance/balance.service';
import { WarehouseStakeholder } from 'app/warehouse-stakeholder/warehouse-stakeholder';
import {WarehouseAutocomplete} from 'app/warehouse/warehouse-autocomplete'

@Component({
  selector: 'app-purchase-order-form',
  templateUrl: './purchase-order-form.component.html'
})
export class PurchaseOrderFormComponent implements OnInit, OnDestroy {

  purchaseOrder: PurchaseOrder;
  form: FormGroup;
  loading: boolean = false;
  integerMask = Masks.integerMask;
  decimalMask = Masks.decimalMask;
  dateMask = Masks.dateMask;
  confirmModal: ModalManager = new ModalManager();
  formSalesmanModal = new ModalManager();

  packTypes: Array<PackType>;
  status: Array<PurchaseOrderStatus>;

  clientAutocomplete: WarehouseStakeholderAutocomplete;
  clientSubscription: Subscription;
  salesmanAutocomplete: WarehouseStakeholderAutocomplete;
  salesmanSubscription: Subscription;
  cityAutocomplete: CityAutocomplete;
  citySubscription: Subscription;
  warehouseAutocomplete: WarehouseAutocomplete;
  warehouseSubcription: Subscription;

  // para verificar se a tela da balança  é unificada com a da portaria
  unifiedBalanceLobby: boolean;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private purchaseOrderService: PurchaseOrderService,
    private packTypeService: PackTypeService,
    private formBuilder: FormBuilder,
    private auth: AuthService,
    private warehouseStakeholderService: WarehouseStakeholderService,
    private cityService: CityService,
    private balanceService: BalanceService,
    private errorHandler: ErrorHandler) { }

  ngOnInit() {
    this.confirmModal.opened = false;
    Notification.clearErrors();

    this.clientAutocomplete = new WarehouseStakeholderAutocomplete(this.warehouseStakeholderService, this.errorHandler);
    this.salesmanAutocomplete = new WarehouseStakeholderAutocomplete(this.warehouseStakeholderService, this.errorHandler);
    this.cityAutocomplete = new CityAutocomplete(this.cityService, this.errorHandler);
    this.warehouseAutocomplete = new WarehouseAutocomplete(this.auth, this.errorHandler);

    this.status = PurchaseOrderStatus.list();

    this.packTypeService.list().then(packTypes => {
      this.packTypes = packTypes;
    });

    this.balanceService.unifiedWithLobby().then(value => {
      this.unifiedBalanceLobby = value;
    });

    // para edição
    let id = (this.route.params['value']) ? this.route.params['value'].id : null;
    if (id) {
      this.purchaseOrderService.find(id).then(purchaseOrder => {
        if (purchaseOrder) {
          this.purchaseOrder = purchaseOrder;
          this.clientAutocomplete.value = purchaseOrder.client;
          this.salesmanAutocomplete.value = purchaseOrder.salesman;
          this.cityAutocomplete.value = purchaseOrder.loadingCity;
          this.warehouseAutocomplete.value = purchaseOrder.loadingWarehouse;
          this.buildForm();
        }
      });
    }
    else {
      this.clearForm();
    }
  }

  ngOnDestroy() {
    let subscriptions = [this.clientSubscription, this.salesmanSubscription, this.citySubscription, this.warehouseSubcription];
    subscriptions.forEach((subscription: Subscription) => {
      if (subscription && !subscription.closed) {
        subscription.unsubscribe();
      }
    });
  }

  buildForm() {

    this.form = this.formBuilder.group({
      'purchaseOrderCode': [this.purchaseOrder.purchaseOrderCode || '', [Validators.required]],
      'loadingDateString': [this.purchaseOrder.loadingDateString || '', [Validators.required]],
      'downloadForecastDateString': [this.purchaseOrder.downloadForecastDateString || '', [Validators.required]],
      'clientId': [(this.purchaseOrder.client) ? this.purchaseOrder.client.id : '', [Validators.required]],
      'sacksQuantity': [this.purchaseOrder.sacksQuantity || '', [Validators.required]],
      'packTypeId': [(this.purchaseOrder.packType) ? this.purchaseOrder.packType.id : ''],
      'salesmanId': [(this.purchaseOrder.salesman) ? this.purchaseOrder.salesman.id : '', [Validators.required]],
      'loadingWarehouseId': [(this.purchaseOrder.loadingWarehouse) ? this.purchaseOrder.loadingWarehouse.id : ''],
      'loadingCityId': [(this.purchaseOrder.loadingCity) ? this.purchaseOrder.loadingCity.id : '', [Validators.required]],
      'dischargedQuantity': [this.purchaseOrder.dischargedQuantity || ''],
      // status é atualizado automaticamente no Back
      //'status': [this.purchaseOrder.status || '', [Validators.required]],
    });

    this.clientSubscription = this.clientAutocomplete.valueChange.subscribe((value) => {
      const id = value ? value.id : null;
      this.form.get('clientId').setValue(id);
    });

    this.salesmanSubscription = this.salesmanAutocomplete.valueChange.subscribe((value) => {
      const id = value ? value.id : null;
      this.form.get('salesmanId').setValue(id);
    });

    this.citySubscription = this.cityAutocomplete.valueChange.subscribe((value) => {
      const id = value ? value.id : null;
      this.form.get('loadingCityId').setValue(id);
    });

    this.warehouseSubcription = this.warehouseAutocomplete.valueChange.subscribe((value) => {
      const id = value ? value.id : null;
      this.form.get('loadingWarehouseId').setValue(id);
    });
  }

  clearForm() {
    this.purchaseOrder = new PurchaseOrder();
    this.clientAutocomplete.value = null;
    this.salesmanAutocomplete.value = null;
    this.cityAutocomplete.value = null;
    this.warehouseAutocomplete.value = null;
    this.buildForm();
  }

  onFormSalesmanModalClose(warehouseStakeholder: WarehouseStakeholder) {
    (<any>jQuery)('.modal').modal('hide');
    this.formSalesmanModal.close();
    this.salesmanAutocomplete.value = warehouseStakeholder;
  }

  save() {

    Object.keys(this.form.controls).forEach(key => {
      this.form.controls[key].markAsDirty();
    });

    if (!this.form.valid) {
      return;
    }

    this.loading = true;

    this.purchaseOrder.purchaseOrderCode = this.form.value.purchaseOrderCode;
    this.purchaseOrder.loadingDateString = this.form.value.loadingDateString;
    this.purchaseOrder.downloadForecastDateString = this.form.value.downloadForecastDateString;
    this.purchaseOrder.client = this.clientAutocomplete.value;
    this.purchaseOrder.sacksQuantity = this.form.value.sacksQuantity;
    this.purchaseOrder.packType = (this.form.value.packTypeId != null)
      ? new PackType(this.form.value.packTypeId)
      : null;
    this.purchaseOrder.salesman = this.salesmanAutocomplete.value;
    this.purchaseOrder.loadingWarehouse = (this.form.value.loadingWarehouseId != null)
      ? new Warehouse(this.form.value.loadingWarehouseId)
      : null;
    this.purchaseOrder.loadingCity = this.cityAutocomplete.value;
    this.purchaseOrder.dischargedQuantity = this.form.value.dischargedQuantity;

    return this.purchaseOrderService.save(this.purchaseOrder).then(() => {
      Notification.success('Ordem de compra salva com sucesso!');
      this.router.navigate(['/purchase-order']);
    }).catch(error => this.handleError(error));
  }

  handleError(error) {
    this.loading = false;
    return this.errorHandler.fromServer(error);
  }
}
