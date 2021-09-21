import { ServiceGroupItemPriceService } from '../service-group-item-price.service';
import { ServiceGroupItemPrice } from '../service-group-item-price';
import { ServiceItem } from '../../service-item/service-item';
import { ServiceItemService } from '../../service-item/service-item.service';
import { ErrorHandler } from './../../shared/errors/error-handler';
import { Masks } from './../../shared/forms/masks/masks';
import { Notification } from './../../shared/notification/notification';

import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';

@Component({
  selector: 'app-service-group-item-price-form',
  templateUrl: './service-group-item-price-form.component.html'
})
export class ServiceGroupItemPriceFormComponent implements OnInit {
  serviceGroupItemPrice: ServiceGroupItemPrice;
  itemList: Array<ServiceItem>;
  form: FormGroup;
  loading: boolean = false;
  integerMask = Masks.integerMask;
  decimalMask5Digits = Masks.decimalMask5Digits;
  submitted: boolean = false;
  disableItem: boolean = true;
  dateMask = Masks.dateMask;

  get editing(){
    return !!this.serviceGroupItemPrice && !!this.serviceGroupItemPrice.id;
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private serviceGroupItemPriceService: ServiceGroupItemPriceService,
    private itemService: ServiceItemService,
    private errorHandler: ErrorHandler
  ) { }

  ngOnInit() {
    Notification.clearErrors();
    this.route.data.forEach((data: {serviceGroupItemPrice: ServiceGroupItemPrice}) => {
      this.serviceGroupItemPrice = data.serviceGroupItemPrice;
    });
    this.itemService.list().then((itemList: Array<ServiceItem>) => {
      this.itemList = itemList;
    });
    this.buildForm();
  }

  buildForm() {
    this.form = this.formBuilder.group({
      'initialRangeString': [this.serviceGroupItemPrice.initialRangeString ||'', Validators.required],
      'finalRangeString': [this.serviceGroupItemPrice.finalRangeString || '', Validators.required],
      'price': [this.serviceGroupItemPrice.priceString || '', Validators.required],
      'itemId': [this.serviceGroupItemPrice.serviceGroupItem.serviceItem ? this.serviceGroupItemPrice.serviceGroupItem.serviceItem.id : '', [Validators.required]]
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
    this.serviceGroupItemPrice.initialRangeString = this.form.value.initialRangeString;
    this.serviceGroupItemPrice.finalRangeString = this.form.value.finalRangeString;
    this.serviceGroupItemPrice.priceString = this.form.value.price;

    return this.serviceGroupItemPriceService.save(this.serviceGroupItemPrice).then(() => {
      Notification.success('Grupo de serviço salvo com sucesso!');

      let navigationExtras: NavigationExtras = {
      queryParams: { 'serviceGroupId': this.serviceGroupItemPrice.serviceGroupItem.serviceGroup.id },
      fragment: 'anchor'
    };

      this.router.navigate(['/service-group-item/' + this.serviceGroupItemPrice.serviceGroupItem.id], navigationExtras);
    }).catch(error => this.handleError(error));

  }

  handleError(error) {
    this.loading = false;
    return this.errorHandler.fromServer(error);
  }

}
