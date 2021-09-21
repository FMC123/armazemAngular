import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Notification } from '../../shared/notification';

import {Scale} from "../scale";
import {Warehouse} from "../../warehouse/warehouse";
import {ModBusEquipament} from "../../equipament/mod-bus-equipament/mod-bus-equipament";

import {ScaleService} from "../scale.service";
import {WarehouseService} from "../../warehouse/warehouse.service";
import {ModBusEquipamentService} from "../../equipament/mod-bus-equipament/mod-bus-equipament.service";


@Component({
  selector: 'scale-form',
  templateUrl: './scale-form.component.html'
})
export class ScaleFormComponent implements OnInit {

  warehouses:  Array<Warehouse>;
  modBusEquipaments:  Array<ModBusEquipament>;
  scale: Scale;
  form: FormGroup;
  loading: boolean = false;

  submitted: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private scaleService: ScaleService,
    private warehouseService: WarehouseService,
    private modBusEquipamentService: ModBusEquipamentService
  ) { }

  ngOnInit() {
    Notification.clearErrors();
    this.route.data.forEach((data: {scale: Scale}) => {
      this.scale = data.scale;
    });
    this.warehouseService.listParentCandidates().then((warehouses: Array<Warehouse>) => {
      this.warehouses = warehouses;
    });
    this.modBusEquipamentService.list().then((modBusEquipaments: Array<ModBusEquipament>) => {
      this.modBusEquipaments = modBusEquipaments;
    });
    this.buildForm();
  }

  buildForm() {
    this.form = this.formBuilder.group({
      'ip': [this.scale.ip || '',
        [Validators.required]
      ],
      'description': [this.scale.description || '',
        [Validators.required],

      ],
      'warehouseId': [this.scale.warehouse ? this.scale.warehouse.id : '', [Validators.required]],
      'modelBusEquipament': [this.scale.model ? this.scale.model : '', []]
    });
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
    this.scale.ip = this.form.value.ip;
    this.scale.description = this.form.value.description;

    this.scale.warehouse = new Warehouse();
    this.scale.warehouse.id = this.form.value.warehouseId;

    this.scale.model = (this.form.value.modelBusEquipament != '' ? this.form.value.modelBusEquipament : null);

    this.scaleService.save(this.scale).then((scale) => {
      Notification.success('Salvo com sucesso!');
      this.router.navigate(['/scale']);
    }).catch(() => this.loading = false);
  }



}
