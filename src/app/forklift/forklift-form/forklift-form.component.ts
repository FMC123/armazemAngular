import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators, Validator} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';

import {ForkliftService} from './../forklift.service';
import {Forklift} from './../forklift';
import {Notification} from './../../shared/notification/notification';
import {Warehouse} from "../../warehouse/warehouse";
import {WarehouseService} from "../../warehouse/warehouse.service";
import {AuthService} from "../../auth/auth.service";

@Component({
  selector: 'app-forklift-form',
  templateUrl: './forklift-form.component.html'
})
export class ForkliftFormComponent implements OnInit {

  warehouses: Array<Warehouse>;
  forklift: Forklift;
  form: FormGroup;
  loading: boolean = false;
  disableActiveField: boolean = false;

  submitted: boolean = false;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private formBuilder: FormBuilder,
              private forkliftService: ForkliftService,
              private warehouseService: WarehouseService,
              private loggedUser: AuthService) {
  }

  ngOnInit() {
    Notification.clearErrors();
    this.route.data.forEach((data: {forklift: Forklift}) => {
      this.forklift = data.forklift;
    });

    this.warehouseService.listParentCandidates().then((warehouses: Array<Warehouse>) => {
      this.warehouses = warehouses;
    });

    this.buildForm();
  }

  changeActiveStatus() {
    if (this.form.value.warehouseId === this.loggedUser.accessToken.warehouse.id) {
      this.forklift.warehouse.id = this.form.value.warehouseId;
      this.forklift.active = this.form.value.active;
      this.disableActiveField = false;
    } else {
      this.forklift.warehouse.id = this.form.value.warehouseId;
      this.forklift.active = false;
      this.disableActiveField = true;
    }

    this.buildForm();
  }

  buildForm() {
    this.form = this.formBuilder.group({
      'name': [this.forklift.name || '', Validators.required],
      'model': [this.forklift.model, Validators.required],
      'uniqueIdentifier': [this.forklift.uniqueIdentifier || ''],
      'warehouseId': [this.forklift.warehouse ? this.forklift.warehouse.id : this.loggedUser.accessToken.warehouse.id, Validators.required],
      'active': [this.forklift.active]
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
    this.forklift.name = this.form.value.name;
    this.forklift.model = this.form.value.model;
    this.forklift.uniqueIdentifier = this.form.value.uniqueIdentifier.toUpperCase();
    this.forklift.warehouse = new Warehouse();
    this.forklift.warehouse.id = this.form.value.warehouseId;


    if (this.forklift.warehouse.id !== this.loggedUser.accessToken.warehouse.id) {
      this.forklift.active = false;
    } else {
      this.forklift.active = this.form.value.active;
    }

    this.forkliftService.save(this.forklift).then((forklift) => {
      Notification.success('Empilhadeira salva com sucesso!');
      this.router.navigate(['/forklift']);
    }).catch(() => this.loading = false);
  }

}
