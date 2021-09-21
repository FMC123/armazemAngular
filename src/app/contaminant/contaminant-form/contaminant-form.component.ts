import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';

import {Contaminant} from "../contaminant";

@Component({
  selector: 'app-contaminant-form',
  templateUrl: './contaminant-form.component.html'
})
export class ContaminantFormComponent implements OnInit {
  @Input() loading: boolean;
  @Input() contaminant: Contaminant;
  @Output() formChange: EventEmitter<Contaminant> = new EventEmitter<Contaminant>();

  form: FormGroup;

  constructor(private formBuilder: FormBuilder) {
  }

  ngOnInit() {
    this.buildForm();
  }

  buildForm() {
    this.form = this.formBuilder.group({
      'name': [this.contaminant.name, [Validators.required]],
      'description': [this.contaminant.description, [Validators.required]],
      'allergenic': [this.contaminant.allergenic],
      'traceable': [this.contaminant.traceable]
    });
  }

  submit() {
    Object.keys(this.form.controls).forEach((key) => {
      this.form.controls[key].markAsDirty();
    });
    if (!this.form.valid) {
      return;
    }

    this.contaminant.name = this.form.value.name;
    this.contaminant.description = this.form.value.description;
    this.contaminant.allergenic = this.form.value.allergenic;
    this.contaminant.traceable = this.form.value.traceable;

    this.formChange.emit(this.contaminant);
  }
}
