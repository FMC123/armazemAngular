import { ServiceGroupService } from '../service-group.service';
import { ServiceGroup } from '../service-group';
import { ErrorHandler } from './../../shared/errors/error-handler';
import { Masks } from './../../shared/forms/masks/masks';
import { Notification } from './../../shared/notification/notification';

import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-service-group-form',
  templateUrl: './service-group-form.component.html'
})
export class ServiceGroupFormComponent implements OnInit {
  serviceGroup: ServiceGroup;
  form: FormGroup;
  loading: boolean = false;
  integerMask = Masks.integerMask;
  submitted: boolean = false;
  disableCode: boolean = true;

  get editing(){
    return !!this.serviceGroup && !!this.serviceGroup.id;
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private serviceGroupService: ServiceGroupService,
    private errorHandler: ErrorHandler
  ) { }

  ngOnInit() {
    Notification.clearErrors();
    this.route.data.forEach((data: {serviceGroup: ServiceGroup}) => {
      this.serviceGroup = data.serviceGroup;
      this.buildForm();
    });
  }

  buildForm() {
    this.form = this.formBuilder.group({
      'code': [this.serviceGroup.code || 0, Validators.required],
      'description': [this.serviceGroup.description || '', Validators.required],
      'indGroupToCalc': [this.serviceGroup.indGroupToCalc || false]
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
    this.serviceGroup.code = this.form.value.code;
    this.serviceGroup.description = this.form.value.description;
    this.serviceGroup.indGroupToCalc = this.form.value.indGroupToCalc;

    return this.serviceGroupService.save(this.serviceGroup).then(() => {
      Notification.success('Grupo de serviço salvo com sucesso!');
      this.router.navigate(['/service-group']);
    }).catch(error => this.handleError(error));

  }

  handleError(error) {
    this.loading = false;
    return this.errorHandler.fromServer(error);
  }

}
