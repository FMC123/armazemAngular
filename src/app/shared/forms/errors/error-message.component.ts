import { Component, Host, Input, Optional, SkipSelf } from '@angular/core';
import { FormControl, ControlContainer } from '@angular/forms';
import { ErrorMessages } from './error-messages';

@Component({
    selector: 'app-error-message',
    template: `<div *ngIf="errorMessage !== null" class='text-danger'>
      {{errorMessage}}
    </div>`
})

export class ErrorMessageComponent {
    @Input() controlName: string;
    @Input() label: string;

    constructor(@Optional() @Host() @SkipSelf() private parent: ControlContainer) {}

    get control(){
      return (<any>this.parent.formDirective).control.controls[this.controlName];
    }

    get errorMessage() {
      let errors = this.control.errors;
      for (let propertyName in errors) {
          if (errors.hasOwnProperty(propertyName) && this.control.dirty) {
              if (errors[propertyName] === true) {
                return ErrorMessages.get(propertyName, this.label);
              }else {
                return this.messageWithProperties(errors, propertyName);
              }
          }
      }
      return null;
    }

    private messageWithProperties(errors, propertyName){
      let properties = [];
      for(var key in errors[propertyName]) {
        properties.push(errors[propertyName][key]);
      }
      return ErrorMessages.get(propertyName, this.label, properties);
    }
}
