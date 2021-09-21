import { ServiceItem } from '../../service-item/service-item';
import { ServiceItemService } from '../../service-item/service-item.service';
import { ServiceGroupItemService } from '../service-group-item.service';
import { ServiceGroupItem } from '../service-group-item';
import { ErrorHandler } from './../../shared/errors/error-handler';
import { Masks } from './../../shared/forms/masks/masks';
import { Notification } from './../../shared/notification/notification';

import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-service-group-item-form',
  templateUrl: './service-group-item-form.component.html'
})
export class ServiceGroupItemFormComponent implements OnInit {
  serviceGroupItem: ServiceGroupItem;
  itemList: Array<ServiceItem>;
  form: FormGroup;
  loading: boolean = false;
  integerMask = Masks.integerMask;
  decimalMask = Masks.decimalMask;
  submitted: boolean = false;
  disableItem: boolean = true;

  get editing(){
    return !!this.serviceGroupItem && !!this.serviceGroupItem.id;
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private serviceGroupItemService: ServiceGroupItemService,
    private itemService: ServiceItemService,
    private errorHandler: ErrorHandler
  ) { }

  ngOnInit() {
    Notification.clearErrors();
    this.route.data.forEach((data: {serviceGroupItem: ServiceGroupItem}) => {
      this.serviceGroupItem = data.serviceGroupItem;
    });
    this.itemService.list().then((itemList: Array<ServiceItem>) => {
      this.itemList = itemList;
    });
    this.buildForm();
  }

  buildForm() {
    this.form = this.formBuilder.group({
      'itemId': [this.serviceGroupItem.serviceItem ? this.serviceGroupItem.serviceItem.id : '', [Validators.required]]
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
    this.serviceGroupItem.serviceItem = new ServiceItem();
    this.serviceGroupItem.serviceItem.id = this.form.value.itemId;

    return this.serviceGroupItemService.save(this.serviceGroupItem).then(() => {
      Notification.success('Grupo de serviço salvo com sucesso!');
      this.router.navigate(['/service-group/' + this.serviceGroupItem.serviceGroup.id]);
    }).catch(error => this.handleError(error));

  }

  handleError(error) {
    this.loading = false;
    return this.errorHandler.fromServer(error);
  }

}
