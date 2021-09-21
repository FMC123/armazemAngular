import { Masks } from 'app/shared/forms/masks/masks';
import { Focusable } from '../../shared/forms/focusable/focusable.directive';
import { Component, EventEmitter, Input, OnInit, Output, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ErrorHandler } from 'app/shared/errors/error-handler';
import { WarehouseStakeholder } from '../warehouse-stakeholder';
import { Person } from 'app/person/person';
import { WarehouseStakeholderService } from '../warehouse-stakeholder.service';

@Component({
  selector: 'app-warehouse-stakeholder-form-modal',
  templateUrl: './warehouse-stakeholder-form-modal.component.html'
})
export class WarehouseStakeholderFormModalComponent implements OnInit {

  @Output() close: EventEmitter<WarehouseStakeholder> = new EventEmitter<WarehouseStakeholder>();
  @ViewChildren(Focusable) focusables;
  @Input() titleModel: string;
  @Input() labelNameStakeholder: string;

  integerMask = Masks.integerMask;
  stakeholder: WarehouseStakeholder;
  form: FormGroup;
  loading = false;

  constructor(
    private formBuilder: FormBuilder,
    private service: WarehouseStakeholderService,
    private errorHandler: ErrorHandler,
  ) { }

  ngOnInit() {
    this.stakeholder = new WarehouseStakeholder();
    this.buildForm();
  }

  focusOnInput() {
    return () => {
      if (this.focusables && this.focusables.length > 0) {
        this.focusables.first.focus();
      }
    };
  }

  buildForm() {
    this.form = this.formBuilder.group({
      personName: ['', Validators.required],
      document: ['', Validators.required],
      personType: ['', Validators.required]
    });
  }

  clearForm() {
    this.buildForm();
  }

  submit() {
    Object.keys(this.form.controls).forEach((key) => {
      this.form.controls[key].markAsDirty();
    });

    if (!this.form.valid) {
      return;
    }

    this.stakeholder.person = new Person()
    this.stakeholder.person.name = this.form.value.personName;
    this.stakeholder.person.document = this.form.value.document;
    this.stakeholder.person.personType = this.form.value.personType;

    this.loading = true;
    this.service.saveSimplifiedWay(this.stakeholder).then(warehouseStakeholder => {

      this.loading = false;
      this.close.emit(warehouseStakeholder);

    }).catch((error) => {
      this.loading = false;
      this.errorHandler.fromServer(error);
    });
  }
}
