import { ErrorHandler } from './../../shared/errors/error-handler';
import { Notification } from './../../shared/notification/notification';
import { ServiceInstructionType } from './../service-instruction-type';
import { ServiceInstructionTypeService } from './../service-instruction-type.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ServiceInstructionTypePurpose } from '../../service-instruction-type/service-instruction-type-purpose';
import { Masks } from './../../shared/forms/masks/masks';

@Component({
  selector: 'app-service-instruction-type-form',
  templateUrl: './service-instruction-type-form.component.html'
})


export class ServiceInstructionTypeFormComponent implements OnInit {
  serviceInstructionType: ServiceInstructionType;
  form: FormGroup;
  loading: boolean = false
  purposes = ServiceInstructionTypePurpose.list();
  typeCodeMask = { mask: [/[A-Z]/i, /[A-Z]/i, /[A-Z]/i], guide: false };

  get editing() {
    return !!this.serviceInstructionType && !!this.serviceInstructionType.id;
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private serviceInstructionTypeService: ServiceInstructionTypeService,
    private errorHandler: ErrorHandler
  ) { }

  ngOnInit() {
    Notification.clearErrors();

    this.route.data.forEach((data: { serviceInstructionType: ServiceInstructionType }) => {
      this.serviceInstructionType = data.serviceInstructionType;
      this.buildForm();
    });
  }

  buildForm() {
    this.form = this.formBuilder.group({
      code: [this.serviceInstructionType.code || '', Validators.required],
      name: [this.serviceInstructionType.name || '', [Validators.required]],
      purpose: [this.serviceInstructionType.purpose || '', [Validators.required]]
    });
  }

  save() {
    Object.keys(this.form.controls).forEach(key => {
      this.form.controls[key].markAsDirty();
    });

    if (!this.form.valid) {
      return;
    }

    this.loading = true;

    this.serviceInstructionType.code = this.form.value.code.toUpperCase();
    this.serviceInstructionType.name = this.form.value.name;
    this.serviceInstructionType.purpose = this.form.value.purpose;

    return this.serviceInstructionTypeService
      .save(this.serviceInstructionType)
      .then(() => {
        Notification.success('Tipo de Instrução de Serviço salva com sucesso!');
        this.router.navigate(['/service-instruction-type']);
      })
      .catch(error => this.handleError(error));
  }

  handleError(error) {
    this.loading = false;
    return this.errorHandler.fromServer(error);
  }
}
