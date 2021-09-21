import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { Notification } from './../../shared/notification/notification';
import { Warehouse } from '../../warehouse/warehouse';
import { Company } from '../company';
import { CompanyService } from '../company.service';
import { WarehouseService } from '../../warehouse/warehouse.service';


@Component({
  selector: 'company-form',
  templateUrl: './company-form.component.html'
})
export class CompanyFormComponent implements OnInit {

  warehouses: Array<Warehouse>;
  company: Company;
  form: FormGroup;
  loading: boolean = false;

  submitted: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private companyService: CompanyService,
    private warehouseService: WarehouseService
  ) { }

  ngOnInit() {
    Notification.clearErrors();
    this.route.data.forEach((data: { company: Company }) => {
      this.company = data.company;
      this.buildForm();
    });
  }

  buildForm() {
    this.form = this.formBuilder.group({
      'code': [this.company.codeAX || '', [Validators.required]],
      'name': [this.company.name || '', [Validators.required]],
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
    this.company.codeAX = this.form.value.code;
    this.company.name = this.form.value.name;
    this.companyService.save(this.company).then((company) => {
      Notification.success('Companhia salva com sucesso!');
      this.router.navigate(['/company']);
    }).catch(() => this.loading = false);
  }



}
