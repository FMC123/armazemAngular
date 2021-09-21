import { ParameterType } from '../parameter-type';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { Notification } from './../../shared/notification/notification';
import {Warehouse} from "../../warehouse/warehouse";
import {Parameter} from "../parameter";
import {ParameterService} from "../parameter.service";
import {WarehouseService} from "../../warehouse/warehouse.service";


@Component({
  selector: 'parameter-form',
  templateUrl: './parameter-form.component.html'
})
export class ParameterFormComponent implements OnInit {

  warehouses:  Array<Warehouse>;
  parameter: Parameter;
  form: FormGroup;
  loading: boolean = false;
  submitted: boolean = false;
  types: Array<ParameterType> = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private parameterService: ParameterService,
    private warehouseService: WarehouseService
  ) { }

  ngOnInit() {
    Notification.clearErrors();

    this.route.data.forEach((data: {parameter: Parameter}) => {
      this.parameter = Parameter.fromData(data.parameter);
    });

    this.warehouseService.listParentCandidates().then((warehouses: Array<Warehouse>) => {
      this.warehouses = Warehouse.fromListData(warehouses);
    });

    this.parameterService.types().then((types: Array<ParameterType>) => {
      this.types = ParameterType.fromListData(types);
    });

    this.buildForm();
  }

  buildForm() {
    this.form = this.formBuilder.group({
      'keys': [this.parameter.keys || '',
        [Validators.required]
      ],
      'value': [this.parameter.value || '',
        [Validators.required],

      ],
      'warehouseId': [this.parameter.warehouse ? this.parameter.warehouse.id : '', [Validators.required]]
    });
  }

  get choices() {
    if (!this.form || !this.form.value.keys) {
      return null;
    }

    let type = this.types.find(t => t.code === this.form.value.keys);

    if (!type) {
      return null;
    }

    return type.choices;
  }

  save() {
    this.submitted = true;

    Object.keys(this.form.controls).forEach((key) => {
      this.form.controls[key].markAsDirty();
    });

    if (!this.form.valid) {
      return;
    }
    this.loading = true;
    this.parameter.keys = this.form.value.keys;
    this.parameter.value = this.form.value.value;
    this.parameter.warehouse = new Warehouse();
    this.parameter.warehouse.id = this.form.value.warehouseId;

    this.parameterService.save(this.parameter).then((parameter) => {
      Notification.success('Parâmetro salvo com sucesso!');
      this.router.navigate(['/parameter']);
    }).catch(() => this.loading = false);
  }

}
