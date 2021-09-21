import { BatchStatus } from '../../batch/batch-status';
import { Strainer } from '../../strainer/strainer';
import { Drink } from '../../drink/drink';
import { PackType } from '../../pack-type/pack-type';
import { StrainerService } from '../../strainer/strainer.service';
import { DrinkService } from '../../drink/drink.service';
import { PackTypeService } from '../../pack-type/pack-type.service';
import { Component, OnInit, Input, Output, OnDestroy, EventEmitter }      from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { CustomValidators } from './../../shared/forms/validators/custom-validators';
import { WarehouseService } from './../../warehouse/warehouse.service';
import { Masks } from './../../shared/forms/masks/masks';
import { Warehouse } from './../../warehouse/warehouse';
import { BatchLogFilter } from './../batch-log-filter';

@Component({
  selector: 'app-batch-log-filter',
  templateUrl: './batch-log-filter.component.html'
})
export class BatchLogFilterComponent implements OnInit {
  @Input() loading: boolean;
  @Output() filterChange: EventEmitter<BatchLogFilter> = new EventEmitter<BatchLogFilter>();

  warehouses: Array<Warehouse>;
  packTypes: Array<PackType>;
  drinks: Array<Drink>;
  strainers: Array<Strainer>;

  form: FormGroup;
  integerMask: any = Masks.integerMask;
  dateTimeMask: any = Masks.dateTimeMask;
  dateMask: any = Masks.dateMask;
  decimalMask: any = Masks.decimalMask;

  filter: BatchLogFilter = new BatchLogFilter();

  get statusBatch() {
    return BatchStatus.list();
}

  constructor(private warehouseService: WarehouseService,
              private formBuilder: FormBuilder,
              private packTypeService: PackTypeService,
              private drinkService: DrinkService,
              private strainerService: StrainerService) {}

  ngOnInit() {
    this.warehouseService.list().then((warehouses) => {
      this.warehouses = warehouses;
    });

    this.packTypeService.list().then((packTypes) => {
      this.packTypes = packTypes;
    });

    this.drinkService.list().then((drinks) => {
      this.drinks = drinks;
    });

    this.strainerService.list().then((strainers) => {
      this.strainers = strainers;
    });

    this.buildForm();
  }

  buildForm() {
    this.form = this.formBuilder.group({
      'userName': [''],
      'batchCode': [''],
      'batchOperationCode': [''],
      'warehouseId': [''],
      'packTypeId': [''],
      'drinkId': [''],
      'strainerId': [''],
      'status': [''],
      'refClient': [''],
      'initialCreatedDateString': [
        '',
        [ CustomValidators.dateValidator() ]
      ],
      'finalCraetedDateString': [
        '',
        [ CustomValidators.dateValidator() ]
      ]
    });
  }

  submit() {
    Object.keys(this.form.controls).forEach((key) => {
      this.form.controls[key].markAsDirty();
    });
    if (!this.form.valid) {
      return;
    }

    this.filter = new BatchLogFilter();
    this.filter.user.name = this.form.value.userName;
    this.filter.warehouse.id = this.form.value.warehouseId;
    this.filter.batchCode = this.form.value.batchCode;
    this.filter.batchOperationCode = this.form.value.batchOperationCode;
    this.filter.refClient = this.form.value.refClient;
    if (this.form.value.packTypeId) {
      let packType: PackType = new PackType();
      packType.id = this.form.value.packTypeId;
      this.filter.packType = packType;
    }
    if (this.form.value.drinkId) {
      let drink: Drink = new Drink();
      drink.id = this.form.value.drinkId;
      this.filter.drink = drink;
    }
    if (this.form.value.strainerId) {
      let strainer: Strainer = new Strainer();
      strainer.id = this.form.value.strainerId;
      this.filter.strainer = strainer;
    }
    if (this.form.value.status) {
      this.filter.batchStatus = new BatchStatus(this.form.value.status);

    }
    this.filter.initialCreatedDateString = this.form.value.initialCreatedDateString;
    this.filter.finalCreatedDateString = this.form.value.finalCraetedDateString;
    this.filterChange.emit(this.filter);
  }

}
