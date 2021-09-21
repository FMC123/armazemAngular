import { Masks } from '../../shared/forms/masks/masks';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { Notification } from './../../shared/notification/notification';
import { Warehouse } from '../../warehouse/warehouse';
import { Drink } from '../drink';
import { DrinkService } from '../drink.service';
import { WarehouseService } from '../../warehouse/warehouse.service';


@Component({
  selector: 'drink-form',
  templateUrl: './drink-form.component.html'
})
export class DrinkFormComponent implements OnInit {

  warehouses: Array<Warehouse>;
  drink: Drink;
  form: FormGroup;
  loading: boolean = false;
  integerMask = Masks.integerMask;

  submitted: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private drinkService: DrinkService,
    private warehouseService: WarehouseService
  ) { }

  ngOnInit() {
    Notification.clearErrors();
    this.route.data.forEach((data: { drink: Drink }) => {
      this.drink = data.drink;
      this.buildForm();
    });
  }

  buildForm() {
    this.form = this.formBuilder.group({
      'code': [this.drink.code || '', [Validators.required]],
      'name': [this.drink.name || '', [Validators.required]],
      // 'description': [this.drink.description || '', [Validators.required]],
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

    this.drink.code = this.form.value.code;
    this.drink.name = this.form.value.name;
    this.drink.description = this.form.value.description;
    this.drinkService.save(this.drink).then((drink) => {
      Notification.success('Salvo com sucesso!');
      this.router.navigate(['/drink']);
    }).catch(() => this.loading = false);
  }



}
