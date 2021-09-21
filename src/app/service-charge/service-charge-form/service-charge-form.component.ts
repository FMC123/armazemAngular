import { BatchOperationStatus } from '../../batch-operation/batch-operation-status';
import { Page } from '../../shared/page/page';
import { ServiceChargeService } from '../service-charge.service';
import { DrinkService } from '../../drink/drink.service';
import { Drink } from '../../drink/drink';
import { ServiceCharge } from '../service-charge';
import { ServiceItemService } from '../../service-item/service-item.service';
import { ServiceItem } from '../../service-item/service-item';
import * as console from 'console';
import { CustomValidators } from '../../shared/forms/validators/custom-validators';
import { NumberHelper } from '../../shared/globalization';
import { PackStockMovementGroupRecordType } from '../../pack-stock/pack-stock-movement-group-record-type';
import { DateSyncService } from '../../date-sync/date-sync.service';
import { BatchOperation } from '../../batch-operation/batch-operation';
import { PackType } from '../../pack-type/pack-type';
import { PackTypeService } from '../../pack-type/pack-type.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { errorHandler } from '@angular/platform-browser/src/browser';
import { PackStockService } from '../../pack-stock/pack-stock.service';
import { WarehouseStakeholderService } from '../../warehouse-stakeholder/warehouse-stakeholder.service';
import { PackStockMovementGroup } from '../../pack-stock/pack-stock-movement-group';
import { PackStockMovement } from '../../pack-stock/pack-stock-movement';
import { Masks } from '../../shared/forms/masks/masks';
import { WarehouseStakeholder } from '../../warehouse-stakeholder/warehouse-stakeholder';
import { ModalManager } from '../../shared/modals/modal-manager';
import { error } from 'util';
import { ErrorHandler } from '../../shared/errors/error-handler';
import { Notification } from '../../shared/notification';
import { selector } from 'rxjs/operator/multicast';
import { Scale } from '../../scale/scale';
import { ScaleService } from '../../scale/scale.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, EventEmitter, group, Input, OnInit, Output } from '@angular/core';


@Component({
  selector: 'app-service-charge-form',
  templateUrl: './service-charge-form.component.html'
})


export class ServiceChargeComponent implements OnInit {

  @Input() batchOperation: BatchOperation;
  form: FormGroup;
  itens: Array<ServiceItem>;
  drinks: Array<Drink>;
  serviceCharge: ServiceCharge;
  serviceCharges: Array<ServiceCharge>;
  loading = false;
  deleteConfirm: ModalManager = new ModalManager();
  decimalMask = Masks.decimalMask;

  page: Page<ServiceCharge> = new Page<ServiceCharge>();

  constructor(
    private itemService: ServiceItemService,
    private drinkService: DrinkService,
    private serviceChargeService: ServiceChargeService,
    private formBuilder: FormBuilder,
    private errorHandler: ErrorHandler,
  ) { }

  get readOnly() {
    return this.batchOperation && this.batchOperation.status && this.batchOperation.status === BatchOperationStatus.CLOSED.code;
  }

  ngOnInit() {
    this.itemService.list().then(itens => {
      this.itens = itens;
    });

    this.drinkService.list().then(drinks => {
      this.drinks = drinks;
    });

    this.reset();
    this.loadList();
  }

  ngOnDestroy() {
    this.page.changeQuery.unsubscribe();
  }

  reset() {
    this.serviceCharge = new ServiceCharge();
    this.serviceCharge.batchOperation = this.batchOperation;
    this.buildForm();
  }

  edit(serviceCharge: ServiceCharge) {
    this.serviceCharge = serviceCharge;
    this.serviceCharge.batchOperation = this.batchOperation;
    this.buildForm();
  }

  buildForm() {
    this.form = this.formBuilder.group({
      'itemId': [this.serviceCharge.serviceItem ? this.serviceCharge.serviceItem.id || '' : '', [Validators.required]],
      'drinkId': [this.serviceCharge.drink ? this.serviceCharge.drink.id || '' : '', [Validators.required]],
      'quantity': [this.serviceCharge.serviceItemQuantity || '', [Validators.required, CustomValidators.minValidator(1)]],
      'unitType': [this.serviceCharge.unitType || 'SC', [Validators.required]],

    });
  }

  save() {
    Object.keys(this.form.controls).forEach((key) => {
      this.form.controls[key].markAsDirty();
    });

    if (!this.form.valid) {
      return;
    }

    this.loading = true;
    this.serviceCharge.serviceItem = this.itens.find(s => s.id === this.form.value.itemId);
    this.serviceCharge.drink = this.drinks.find(d => d.id === this.form.value.drinkId);
    //this.serviceCharge.quantity = this.form.value.quantity;
    this.serviceCharge.unitType = this.form.value.unitType;
    this.serviceCharge.owner = this.batchOperation.owner;
    this.serviceCharge.batchOperation = this.batchOperation;

    return this.serviceChargeService.save(this.serviceCharge).then(() => {
      Notification.success('Cobrança salva com sucesso!');
      this.reset();
      return this.loadList();
    }).catch((error) => this.handleError(error));
  }

  loadList() {
    this.loading = true;
    this.serviceChargeService.listByBatchOperation(this.batchOperation.id).then((serviceCharges) => {
      this.serviceCharges = serviceCharges;
      this.loading = false;
    }).catch(error => this.handleError(error));
  }

  delete(id: string | number) {
    if (this.serviceCharge && this.serviceCharge.id === id) {
      this.reset();
    }

    this.loading = true;
    return this.serviceChargeService.delete(id).then(() => {
      Notification.success('Cobrança excluída com sucesso!');
      return this.loadList();
    }).catch(error => this.handleError(error));
  }

  handleError(error) {
    this.loading = false;
    return this.errorHandler.fromServer(error);
  }

}
