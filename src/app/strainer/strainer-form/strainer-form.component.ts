import { Masks } from '../../shared/forms/masks/masks';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { Notification } from '../../shared/notification';
import {Warehouse} from '../../warehouse/warehouse';
import {Strainer} from '../strainer';
import {StrainerService} from '../strainer.service';
import {WarehouseService} from '../../warehouse/warehouse.service';


@Component({
  selector: 'strainer-form',
  templateUrl: './strainer-form.component.html'
})
export class StrainerFormComponent implements OnInit {

  warehouses:  Array<Warehouse>;
  strainer: Strainer;
  form: FormGroup;
  loading: boolean = false;
  integerMask = Masks.integerMask;


  submitted: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private strainerService: StrainerService,
    private warehouseService: WarehouseService
  ) { }

  ngOnInit() {
    Notification.clearErrors();
    this.route.data.forEach((data: {strainer: Strainer}) => {
      this.strainer = data.strainer;
      this.buildForm();
    });
  }

  buildForm() {
    this.form = this.formBuilder.group({
          'code': [this.strainer.code || '', [Validators.required]],
          'description': [this.strainer.description || '', [Validators.required]],
          'consume': [this.strainer.consume || '', [Validators.required]],
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
    this.strainer.code = this.form.value.code;
    this.strainer.description = this.form.value.description;
    this.strainer.consume = this.form.value.consume;
    this.strainerService.save(this.strainer).then((strainer) => {
      Notification.success('salvo com sucesso!');
      this.router.navigate(['/strainer']);
    }).catch(() => this.loading = false);
  }



}
