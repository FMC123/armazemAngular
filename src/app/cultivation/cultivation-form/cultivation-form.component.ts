import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { Notification } from './../../shared/notification/notification';
import { Warehouse } from '../../warehouse/warehouse';
import { Cultivation } from '../cultivation';
import { CultivationService } from '../cultivation.service';
import { WarehouseService } from '../../warehouse/warehouse.service';


@Component({
  selector: 'cultivation-form',
  templateUrl: './cultivation-form.component.html'
})
export class CultivationFormComponent implements OnInit {

  warehouses: Array<Warehouse>;
  cultivation: Cultivation;
  form: FormGroup;
  loading: boolean = false;

  submitted: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private cultivationService: CultivationService,
    private warehouseService: WarehouseService
  ) { }

  ngOnInit() {
    Notification.clearErrors();
    this.route.data.forEach((data: { cultivation: Cultivation }) => {
      this.cultivation = data.cultivation;
      this.buildForm();
    });
  }

  buildForm() {
    this.form = this.formBuilder.group({
      'cultivationName': [this.cultivation.cultivationName || '', [Validators.required]],
      'cultivationDescription': [this.cultivation.cultivationDescription || '', [Validators.required]],
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

    this.cultivation.cultivationName = this.form.value.cultivationName;
    this.cultivation.cultivationDescription = this.form.value.cultivationDescription;
    this.cultivationService.save(this.cultivation).then((cultivation) => {
      Notification.success('Salvo com sucesso!');
      this.router.navigate(['/cultivation']);
    }).catch(() => this.loading = false);
  }



}
