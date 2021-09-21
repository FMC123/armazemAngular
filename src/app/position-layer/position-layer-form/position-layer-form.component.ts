import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { Notification } from './../../shared/notification/notification';
import {Warehouse} from "../../warehouse/warehouse";
import {PositionLayer} from "../position-layer";
import {PositionLayerService} from "../position-layer.service";
import {WarehouseService} from "../../warehouse/warehouse.service";


@Component({
  selector: 'position-layer-form',
  templateUrl: './position-layer-form.component.html'
})
export class PositionLayerFormComponent implements OnInit {

  warehouses:  Array<Warehouse>;
  positionLayer: PositionLayer;
  form: FormGroup;
  loading: boolean = false;

  submitted: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private positionLayerService: PositionLayerService,
    private warehouseService: WarehouseService
  ) { }

  ngOnInit() {
    Notification.clearErrors();
    this.route.data.forEach((data: {positionLayer: PositionLayer}) => {
      this.positionLayer = data.positionLayer;
    });
    this.warehouseService.listParentCandidates().then((warehouses: Array<Warehouse>) => {
      this.warehouses = warehouses;
    });
    this.buildForm();
  }

  buildForm() {
    this.form = this.formBuilder.group({
      'name': [this.positionLayer.name || '',
        [Validators.required]
      ],
      'code': [this.positionLayer.code || '',
        [Validators.required, Validators.pattern('[0-9]+')],

      ],
      'shiftXString': [this.positionLayer.shiftXString || '0',
        [Validators.required]
      ],
      'shiftYString': [this.positionLayer.shiftYString || '0',
        [Validators.required]
      ],
      'warehouseId': [this.positionLayer.warehouse ? this.positionLayer.warehouse.id : '', [Validators.required]]
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
    this.positionLayer.name = this.form.value.name;
    this.positionLayer.code = +this.form.value.code;
    this.positionLayer.shiftXString = this.form.value.shiftXString;
    this.positionLayer.shiftYString = this.form.value.shiftYString;
    this.positionLayer.active = true;
    this.positionLayer.warehouse = new Warehouse();
    this.positionLayer.warehouse.id = this.form.value.warehouseId;

    this.positionLayerService.save(this.positionLayer).then((positionLayer) => {
      Notification.success('Nave salva com sucesso!');
      this.router.navigate(['/position-layer']);
    }).catch(() => this.loading = false);
  }



}
