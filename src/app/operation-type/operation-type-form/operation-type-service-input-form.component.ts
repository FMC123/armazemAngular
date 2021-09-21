import { ServiceItem } from '../../service-item/service-item';

import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-operation-type-service-input-form',
  templateUrl: 'operation-type-service-input-form.component.html'
})

export class OperationTypeServiceInputFormComponent implements OnInit {
  @Input() public options: Array<ServiceItem> = [];
  @Input() public selecteds: Array<ServiceItem> = [];

  form: FormGroup;
  loading: boolean = false;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.buildForm();
  }

  buildForm() {
    this.form = this.formBuilder.group({
      'itemId': ['', Validators.required],
    });
  }

  get availableOptions(){
    return this.options.filter((u) => {
      let alreadyInList = this.selecteds.some((au) => au.id === u.id );
      return !alreadyInList;
    }) || [];
  }

  add() {
    Object.keys(this.form.controls).forEach((key) => {
      this.form.controls[key].markAsDirty();
    });

    if (!this.form.valid) {
      return;
    }

    let itemId = this.form.value.itemId;
    let item = this.options.find(i => i.id === itemId);
    this.selecteds.push(item);

    this.buildForm();
  }

  remove(id: string) {
    this.selecteds.splice(this.selecteds.findIndex((i) => i.id === id), 1);
  }

}
