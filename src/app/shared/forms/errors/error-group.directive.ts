import { Directive, OnInit, HostBinding, ContentChild } from '@angular/core';

import { ErrorMessageComponent } from './error-message.component';

@Directive({
  selector: '[appErrorGroup]',
})
export class ErrorGroupDirective {
  @ContentChild(ErrorMessageComponent) errorMessageComponent;

  @HostBinding('class.has-feedback')
  hasFeedback: boolean = true;

  @HostBinding('class.has-error')
  get hasError(): boolean{
    if (!this.errorMessageComponent) {
      return false;
    }
    return !!this.errorMessageComponent.errorMessage;
  }

}
