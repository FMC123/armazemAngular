import { CustomValidators } from '../../../../shared/forms/validators/custom-validators';
import { NumberHelper } from '../../../../shared/globalization';
import { PackTypeService } from '../../../../pack-type/pack-type.service';
import { Focusable } from '../../../../shared/forms/focusable/focusable.directive';
import { PackStockMovement } from '../../../pack-stock-movement';
import { Masks } from '../../../../shared/forms/masks/masks';
import { PackType } from '../../../../pack-type/pack-type';
import { OnDestroy, AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChildren } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Subscription } from 'rxjs/Rx';

@Component({
  selector: 'app-pack-stock-movement-form-modal',
  templateUrl: './pack-stock-movement-form-modal.component.html'
})
export class PackStockMovementFormModalComponent implements OnInit {
  @Output() close: EventEmitter<void> = new EventEmitter<void>(false);
  @Input() indStockOut = false;
  @Input() movement: PackStockMovement;
  @Output() save: EventEmitter<PackStockMovement> = new EventEmitter<PackStockMovement>(false);

  @ViewChildren(Focusable) focusables;

  integerMask = Masks.integerMask;
  decimalMask = Masks.decimalMask;
  dateMask = Masks.dateMask;

  packTypes: Array<PackType>;

  form: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private packTypeService: PackTypeService,
  ) {}

  ngOnInit() {
    this.packTypeService.list().then(packTypes => {
      this.packTypes = packTypes.filter(pt => pt.trackStock);
    });

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
    let group = {
      'packTypeId': [ this.movement.packType ? this.movement.packType.id || '' : '', Validators.required ],
      'quantityVariation': [
        Math.abs(this.movement.quantityVariation) || 0,
        [ Validators.required, CustomValidators.minValidator(1) ]
      ],
      'unitValueString': [
        this.movement.unitValueString || '',
        [ Validators.required, CustomValidators.minValidator(0.01) ]
      ],
    };

    if (this.indStockOut) {
      delete group['unitValueString'];
    }

    this.form = this.formBuilder.group(group);
  }

  get totalPriceString() {
    let quantity = Math.abs(this.form.value.quantityVariation);
    let unitPrice = NumberHelper.fromPTBR(this.form.value.unitValueString);

    return NumberHelper.toPTBR(quantity * unitPrice);
  }

  get unitWeightString() {
    if (!this.packTypes) {
      return NumberHelper.toPTBR(0);
    }

    let packType = this.packTypes.find(pt => pt.id === this.form.value.packTypeId);

    if (!packType) {
      return NumberHelper.toPTBR(0);
    }

    return packType.weightString;
  }

  get totalWeightString() {
    if (!this.packTypes) {
      return NumberHelper.toPTBR(0);
    }

    let quantity = Math.abs(this.form.value.quantityVariation);
    let packType = this.packTypes.find(pt => pt.id === this.form.value.packTypeId);

    if (!packType) {
      return NumberHelper.toPTBR(0);
    }

    return NumberHelper.toPTBR(quantity * packType.weight);
  }

  submit() {
    Object.keys(this.form.controls).forEach((key) => {
      this.form.controls[key].markAsDirty();
    });

    if (!this.form.valid) {
      return;
    }

    this.movement.packType = this.packTypes.find(pt => pt.id === this.form.value.packTypeId);
    this.movement.quantityVariation = Math.abs(this.form.value.quantityVariation);
    this.movement.unitValueString = this.form.value.unitValueString;

    if (this.indStockOut) {
      this.movement.quantityVariation = -this.movement.quantityVariation;
    }

    this.save.emit(this.movement);
    (<any>jQuery)('.modal').modal('hide');
  }

}
