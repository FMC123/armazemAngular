import { ValidatorFn, AbstractControl } from '@angular/forms';
import { NumberHelper } from '../../globalization/number-helper';
import { DateTimeHelper } from '../../globalization/date-time-helper';
import {ServiceInstructionTypePurpose} from "../../../service-instruction-type/service-instruction-type-purpose";

export class CustomValidators {
  static dateTimeValidator(): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} => {
      const value = control.value;
      if (!value) return;
      try {
        let converted = DateTimeHelper.fromDDMMYYYYHHmm(value);
        if (!converted) {
          throw new Error();
        };
        return null;
      }catch (err) {
        return { 'dateTimeInvalid': true };
      }
    };
  }

  static autocompleteRequired(): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} => {
      const value = control.value;
      if (value){
        return null;
      }
      return { 'autocompleteRequired': true };
    };
  }

  static dateValidator(): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} => {
      const value = control.value;
      if (!value) return;
      try {
        let converted = DateTimeHelper.fromDDMMYYYY(value);
        if (!converted) {
          throw new Error();
        };
        return null;
      }catch (err) {
        return { 'dateInvalid': true };
      }
    };
  }

  static equalValidator(otherName: string, otherLabel?: string): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} => {
      const value = control.value;
      let other = control.root.get(otherName);

      if (value && value !== other.value) {
        return {'equalInvalid': {otherLabel: otherLabel ? otherLabel : otherName }};
      }

      return null;
    };
  }

  static maxValidator(arg: number, subtypeIS: string = null): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} => {
      const value = control.value;
      if (subtypeIS !== null && subtypeIS === ServiceInstructionTypePurpose.CHARGE.code) return;
      if (!value && value !== '0' && value !== 0) return;
      if (NumberHelper.fromPTBR(value) > arg) {
        let requiredValue = arg % 1 !== 0 ? NumberHelper.toPTBR(arg) : arg;
        return { 'max': {'requiredValue': requiredValue, 'actualValue': value} };
      }
      return null;
    };
  }

  static minValidator(arg: number): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} => {
      const value = control.value;
      if (!value && value !== '0' && value !== 0) return;
      if (NumberHelper.fromPTBR(value) < arg) {
        let requiredValue = arg % 1 !== 0 ? NumberHelper.toPTBR(arg) : arg;
        return { 'min': {'requiredValue': requiredValue, 'actualValue': value} };
      }
      return null;
    };
  }

  static differentBatchesValidator(arg: string): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} => {
      const value = control.value;
      if (value && value.id !== arg) {
        return null;
      }
      return { 'batchSwapBatchesNotDifferent': true };
    };
  }
}
