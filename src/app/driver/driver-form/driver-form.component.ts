import { Masks } from '../../shared/forms/masks/masks';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validator, Validators } from '@angular/forms';

import { Notification } from './../../shared/notification/notification';
import { Driver } from '../driver';
import { DriverService } from '../driver.service';
import {ErrorHandler} from "../../shared/errors/error-handler";


@Component({
  selector: 'driver-form',
  templateUrl: './driver-form.component.html'
})
export class DriverFormComponent implements OnInit {

  driver: Driver;
  form: FormGroup;
  loading: boolean = false;
  submitted: boolean = false;
  dateMask = Masks.dateMask;
  cpfMask = Masks.cpfMask;
  phoneMask = Masks.phoneMask;
  integerMask = Masks.integerMask;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private driverService: DriverService,
    private errorHandler: ErrorHandler
  ) { }

  ngOnInit() {
    Notification.clearErrors();
    this.route.data.forEach((data: { driver: Driver }) => {
      this.driver = data.driver;
      this.buildForm();
    });
  }

  buildForm() {
    this.form = this.formBuilder.group({
      'name': [this.driver.name || '', [Validators.required]],
      'cpf': [this.driver.cpf || '', [Validators.required]],
      'cnh': [this.driver.cnh || '', [Validators.required]],
      'cnhExpirationDate': [this.driver.cnhExpirationDateString || '', [Validators.required]],
      'cellPhone': [this.driver.cellPhone || '', [Validators.required]],
      'blocked': [this.driver.blocked || false, [Validators.required]],
      'observation': [this.driver.observation || '']
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

    this.driver.name = this.form.value.name;
    this.driver.cpf = this.form.value.cpf.replace(/\D/g, '');
    this.driver.cnh = this.form.value.cnh.replace(/\D/g, '');
    this.driver.cnhExpirationDateString = this.form.value.cnhExpirationDate;
    this.driver.cellPhone = this.form.value.cellPhone.replace(/\D/g, '');
    this.driver.blocked = this.form.value.blocked;
    this.driver.observation = this.form.value.observation;
    this.driverService.save(this.driver).then((driver) => {
      Notification.success('Motorista salvo com sucesso!');
      this.router.navigate(['/driver']);
    }).catch(error => {
      this.errorHandler.fromServer(error);
      this.loading = false;
    });
  }

  handleError(error) {
    this.loading = false;
    return this.errorHandler.fromServer(error);
  }
}
