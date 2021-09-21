import { Component, OnInit, Input, Output, OnDestroy, EventEmitter }      from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { CustomValidators } from './../../shared/forms/validators/custom-validators';
import { WarehouseService } from './../../warehouse/warehouse.service';
import { Masks } from './../../shared/forms/masks/masks';
import { Warehouse } from './../../warehouse/warehouse';
import { AccessTokenFilter } from './../access-token-filter';
import { ForkliftService } from 'app/forklift/forklift.service';
import { Forklift } from 'app/forklift/forklift';
import { User } from 'app/user/user';
import { UserService } from 'app/user/user.service';

@Component({
  selector: 'app-access-token-filter',
  templateUrl: './access-token-filter.component.html'
})
export class AccessTokenFilterComponent implements OnInit {
  @Input() loading: boolean;
  @Output() filterChange: EventEmitter<AccessTokenFilter> = new EventEmitter<AccessTokenFilter>();

  warehouses: Array<Warehouse>;
  forklifts: Array<Forklift>;

  form: FormGroup;
  integerMask: any = Masks.integerMask;
  dateTimeMask: any = Masks.dateTimeMask;
  dateMask: any = Masks.dateMask;
  decimalMask: any = Masks.decimalMask;

  filter: AccessTokenFilter = new AccessTokenFilter();

  constructor(
    private userService: UserService,
    private forkliftService: ForkliftService,
    private warehouseService: WarehouseService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.forkliftService.list()
      .then((forklifts) => {
        this.forklifts = forklifts;
      }).then(() => {
        return this.warehouseService.list();
      })
      .then((warehouses) => {
        this.warehouses = warehouses;
      })
      .then(() => this.buildForm());
  }

  buildForm() {
    this.form = this.formBuilder.group({
      'userName': [''],
      'warehouseId': [''],
      'forkliftId': [''],
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
    this.filter = new AccessTokenFilter();
    this.filter.user.name = this.form.value.userName;
    this.filter.warehouse.id = this.form.value.warehouseId;
    this.filter.forkliftId = this.form.value.forkliftId;
    this.filter.initialCreatedDateString = this.form.value.initialCreatedDateString;
    this.filter.finalCreatedDateString = this.form.value.finalCraetedDateString;
    this.filterChange.emit(this.filter);
  }

}
