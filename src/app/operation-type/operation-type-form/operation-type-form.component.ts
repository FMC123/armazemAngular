import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { ServiceItem } from '../../service-item/service-item';
import { ServiceItemService } from '../../service-item/service-item.service';
import { OperationTypeType } from '../operation-type-type';
import { ErrorHandler } from './../../shared/errors/error-handler';
import { Notification } from './../../shared/notification/notification';
import { OperationType } from './../operation-type';
import { OperationTypeService } from './../operation-type.service';

@Component({
  selector: 'app-operation-type-form',
  templateUrl: './operation-type-form.component.html'
})
export class OperationTypeFormComponent implements OnInit {
  operationType: OperationType;
  form: FormGroup;
  loading: boolean = false;
  items: Array<ServiceItem> = [];
  types = OperationTypeType.list();

  get editing(){
    return !!this.operationType && !!this.operationType.id;
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private operationTypeService: OperationTypeService,
    private itemService: ServiceItemService,
    private itemsService: ServiceItemService,
    private errorHandler: ErrorHandler
  ) { }

  ngOnInit() {
    Notification.clearErrors();

    this.itemService.list().then(items => {
      this.items = items;
    }).catch(error => this.handleError(error));

    this.route.data.forEach((data: {operationType: OperationType}) => {
      this.operationType = data.operationType;
      this.buildForm();
    });

  }

  buildForm() {
    this.form = this.formBuilder.group({
      'description': [this.operationType.description || '', [ Validators.required ]],
      'descriptionCounterpart': [this.operationType.descriptionCounterpart || '', [ ]],
      'type': [this.operationType.type || '', [ Validators.required ]],
      'isInputDefaultValue' : [this.operationType.isInputDefaultValue || false, [Validators.required]],
      'isOutputDefaultValue' : [this.operationType.isInputDefaultValue || false, [Validators.required]],
    });
  }

  save() {
    Object.keys(this.form.controls).forEach((key) => {
      this.form.controls[key].markAsDirty();
    });

    if (!this.form.valid) {
      return;
    }

    this.loading = true;

    this.operationType.description = this.form.value.description;
    this.operationType.descriptionCounterpart = this.form.value.descriptionCounterpart;
    this.operationType.type = this.form.value.type;
    this.operationType.isInputDefaultValue = this.form.value.isInputDefaultValue;
    this.operationType.isOutputDefaultValue = this.form.value.isInputDefaultValue;

    return this.operationTypeService.save(this.operationType).then(() => {
      Notification.success('Tipo de Operação salva com sucesso!');
      this.router.navigate(['/operation-type']);
    }).catch((error) => this.handleError(error));
  }

  handleError(error) {
    this.loading = false;
    return this.errorHandler.fromServer(error);
  }

}
