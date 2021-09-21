import {Component, OnInit, Input, Output, OnDestroy, EventEmitter} from '@angular/core';
import {FormGroup, FormBuilder, Validators, ValidatorFn, AbstractControl, FormControl} from '@angular/forms';

import {SkuService} from "../sku.service";
import {Sku} from "../sku";
import {ErrorHandler} from '../../shared/errors/error-handler';
import {SkuAutocomplete} from "../sku-autocomplete";

@Component({
  selector: 'app-sku-form',
  templateUrl: './sku-form.component.html'
})
export class SkuFormComponent implements OnInit {
  @Input() loading: boolean;
  @Input() sku: Sku;
  @Output() formChange: EventEmitter<Sku> = new EventEmitter<Sku>();

  form: FormGroup;
  skuAutocomplete: SkuAutocomplete;
  skuGroupSubscription;

  constructor(
    private formBuilder: FormBuilder,
    private skuService: SkuService,
    private errorHandler: ErrorHandler,
  ) {
  }

  ngOnInit() {
    this.skuAutocomplete = new SkuAutocomplete(
      this.skuService,
      this.errorHandler
    );

    if (this.sku) {
      this.skuAutocomplete.id = this.sku.id;
    }

    this.buildForm();
  }

  buildForm() {
    this.form = this.formBuilder.group({
      'product': [this.sku.product, [Validators.required]],
      'description': [this.sku.description, [Validators.required]],
      'code': [this.sku.code, [Validators.required, Validators.pattern('^.{0,100}$')]],
      'measurement_unit': [this.sku.measurementUnit, [Validators.required, Validators.pattern('^.{0,100}$')]],
      'measurement_acronym': [this.sku.measurementAcronym, [Validators.required, Validators.pattern('^.{0,100}$')]],
      'sku_group': ['', [this.skuValidator()]],
      'sku_quantity': [this.sku.skuQuantity, [Validators.pattern('^([0-9]{1,8},[0-9]{2}|[0-9]{1,9},[0-9]{1}|[0-9]{1,10})$')]],
      'sack_size': [this.sku.sackSize, [Validators.pattern('^([0-9]{1,10})(,([0-9]{1,2}))?$')]]
    });
    this.skuAutocomplete.value = (this.sku.skuGroup && this.sku.skuGroup.label) ? this.sku.skuGroup : '';
    this.skuGroupSubscription = this.skuAutocomplete.valueChange.subscribe(value => {
        if (value === '') {
          this.form.get('sku_group').setValue(value);
        } else {
          const skuComplete = value ? new Sku(value.id) : null;
          this.form.get('sku_group').setValue(skuComplete);
        }
      }
    );
  }

  submit() {
    Object.keys(this.form.controls).forEach((key) => {
      this.form.controls[key].markAsDirty();
    });
    if (!this.form.valid) {
      return;
    }

    this.sku.product = this.form.value.product;
    this.sku.description = this.form.value.description;
    this.sku.code = this.form.value.code;
    this.sku.measurementUnit = this.form.value.measurement_unit;
    this.sku.measurementAcronym = this.form.value.measurement_acronym;
    this.sku.skuGroup = this.form.value.sku_group === '' ? null : this.form.value.sku_group;
    this.sku.skuQuantity = this.form.value.sku_quantity ? this.form.value.sku_quantity.replace(',','.') : null;
    this.sku.sackSize = this.form.value.sack_size ? this.form.value.sack_size.replace(',','.') : null;

    this.formChange.emit(this.sku);
  }

  skuValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const valid: boolean = control.value instanceof Sku || control.value === '';
      return valid ? null : {invalidType: {value: control.value}};
    }
  }

  outputChange(output): void {
    this.form.get('sku_group').setValue(output);
  }
}
