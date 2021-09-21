import {Component, EventEmitter, OnInit, Output, ViewChildren} from '@angular/core';
import {WarehouseStakeholder} from "../warehouse-stakeholder/warehouse-stakeholder";
import {PurchaseOrder} from "../purchase-order/purchase-order";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Masks} from "../shared/forms/masks/masks";
import {ModalManager} from "../shared/modals/modal-manager";
import {PackType} from "../pack-type/pack-type";
import {PurchaseOrderStatus} from "../purchase-order/purchase-order-status";
import {WarehouseStakeholderAutocomplete} from "../warehouse-stakeholder/warehouse-stakeholder-autocomplete";
import {Subscription} from "rxjs";
import {CityAutocomplete} from "../city/city-autocomplete";
import {WarehouseAutocomplete} from "../warehouse/warehouse-autocomplete";
import {ActivatedRoute, Router} from "@angular/router";
import {PurchaseOrderService} from "../purchase-order/purchase-order.service";
import {PackTypeService} from "../pack-type/pack-type.service";
import {AuthService} from "../auth/auth.service";
import {WarehouseStakeholderService} from "../warehouse-stakeholder/warehouse-stakeholder.service";
import {CityService} from "../city/city.service";
import {BalanceService} from "../balance/balance.service";
import {ErrorHandler} from "../shared/errors/error-handler";
import {Notification} from "../shared/notification";
import {Warehouse} from "../warehouse/warehouse";
import {Focusable} from "../shared/forms/focusable/focusable.directive";

@Component({
  selector: 'app-new-purchase-order-modal',
  templateUrl: './new-purchase-order-modal.component.html',
  styleUrls: ['./new-purchase-order-modal.component.css']
})
export class NewPurchaseOrderModalComponent implements OnInit {

  @Output() close: EventEmitter<PurchaseOrder> = new EventEmitter<PurchaseOrder>();
  @ViewChildren(Focusable) focusables;

   purchaseOrder: PurchaseOrder;
   form: FormGroup;
   loading: boolean = false;
   integerMask = Masks.integerMask;
   decimalMask = Masks.decimalMask;
   dateMask = Masks.dateMask;
   confirmModal: ModalManager = new ModalManager();

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

   //para verificar se a tela da balança  é unificada com a da portaria
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
               private errorHandler: ErrorHandler
  ) { }

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
        //status é atualizado automaticamente no Back
       'status': [this.purchaseOrder.status || '', [Validators.required]],
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

   save() {
     Object.keys(this.form.controls).forEach(key => {
       this.form.controls[key].markAsDirty();
     });

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

     console.log('Trying to save purchaseOrder = ', this.purchaseOrder);
     return this.purchaseOrderService.save(this.purchaseOrder).then((res) => {
       console.log('Created purchase order = ', res);
       Notification.success('Ordem de compra salva com sucesso!');
       this.close.emit(res);
     }).catch(error => this.handleError(error));
   }

   handleError(error) {
     this.loading = false;
     return this.errorHandler.fromServer(error);
   }

  focusOnInput() {
    return () => {
      if (this.focusables && this.focusables.length > 0) {
        this.focusables.first.focus();
      }
    };
  }
}
