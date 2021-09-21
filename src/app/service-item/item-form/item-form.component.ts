import { IndustrialType } from '../industrial-type/industrial-type';
import { Masks } from '../../shared/forms/masks/masks';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { Notification } from './../../shared/notification/notification';
import { ServiceItem } from "../service-item";
import { ServiceItemService } from "../service-item.service";
import { ServiceItemUsageType } from '../service-item-usage-type';


@Component({
  selector: 'app-item-form',
  templateUrl: './item-form.component.html'
})
export class ItemFormComponent implements OnInit {

  item: ServiceItem;
  form: FormGroup;
  loading: boolean = false;
  integerMask = Masks.integerMask;
  decimalMask = Masks.decimalMask5Digits;
  industrialTypes: Array<IndustrialType> = IndustrialType.list();
  usages: Array<ServiceItemUsageType> = ServiceItemUsageType.list();
  submitted: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private itemService: ServiceItemService,
  ) { }

  ngOnInit() {
    Notification.clearErrors();
    this.route.data.forEach((data: { item: ServiceItem }) => {
      this.item = data.item;
    });
    this.buildForm();
  }

  buildForm() {
    this.form = this.formBuilder.group({
      'code': [this.item.code || '', [Validators.required]],
      'description': [this.item.description || '', [Validators.required]],
      'indQuoteVal': [this.item.indQuoteVal || false, [Validators.required]],
      'indIss': [this.item.indIss || false, [Validators.required]],
      'indDiscount': [this.item.indDiscount || false, [Validators.required]],
      'industrialType': [this.item.industrialTypeCode || IndustrialType.N.code],
      'batchMask': [this.item.batchMask || '', [Validators.required]],
      'basePrice': [this.item.basePriceString || '0,00', [Validators.required]],
      'groupedCharge': [this.item.groupedCharge || '1', [Validators.required]],
      'usage': [this.item.usage || '', [Validators.required]],
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
    this.item.code = this.form.value.code;
    this.item.description = this.form.value.description.toUpperCase();
    this.item.indQuoteVal = this.form.value.indQuoteVal;
    this.item.indIss = this.form.value.indIss;
    this.item.indDiscount = this.form.value.indDiscount;
    this.item.industrialType = this.form.value.industrialType;
    this.item.batchMask = this.form.value.batchMask.toUpperCase();
    this.item.basePriceString = this.form.value.basePrice;
    this.item.groupedCharge = this.form.value.groupedCharge;
    this.item.usage = this.form.value.usage;

    this.itemService.save(this.item).then((item) => {
      Notification.success('ServiceItem salvo com sucesso!');
      this.router.navigate(['/service-item']);
    }).catch(() => this.loading = false);
  }
}
