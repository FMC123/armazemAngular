import { ErrorHandler } from '../../shared/errors/error-handler';
import { Masks } from '../../shared/forms/masks/masks';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { Notification } from './../../shared/notification/notification';
import {Warehouse} from '../../warehouse/warehouse';
import {EconomicGroup} from '../economic-group';
import {EconomicGroupService} from '../economic-group.service';
import {WarehouseService} from '../../warehouse/warehouse.service';


@Component({
  selector: 'app-economic-group-form',
  templateUrl: './economic-group-form.component.html'
})

export class EconomicGroupFormComponent implements OnInit {

  warehouses:  Array<Warehouse>;
  economicGroup: EconomicGroup;
  form: FormGroup;
  loading: boolean = false;
  integerMask = Masks.integerMask;

  submitted: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private economicGroupService: EconomicGroupService,
    private warehouseService: WarehouseService,
    private errorHandler: ErrorHandler,
  ) { }

  ngOnInit() {
    Notification.clearErrors();
    this.route.data.forEach((data: {economicGroup: EconomicGroup}) => {
      this.economicGroup = data.economicGroup;
      this.buildForm();
    });
  }

  buildForm() {
    this.form = this.formBuilder.group({
          'code': [this.economicGroup && this.economicGroup.code ?  this.economicGroup.code : '' , [Validators.required]],
          'description': [this.economicGroup && this.economicGroup.description
            ? this.economicGroup.description : '', [Validators.required]],
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
    this.economicGroup.code = this.form.value.code;
    this.economicGroup.description = this.form.value.description;
    this.economicGroupService.save(this.economicGroup).then((economicGroup) => {
      Notification.success('salvo com sucesso!');
      this.router.navigate(['/economic-group']);
    }).catch((error) => this.handleError(error));
  }

  handleError(error) {
    this.loading = false;
    return this.errorHandler.fromServer(error);
  }


}
