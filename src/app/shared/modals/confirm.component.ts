import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html'
})

export class ConfirmComponent {
  @Input() message: string;
  @Input() yesLabel: string;
  @Input() noLabel: string;
  @Input() buttonClass = 'btn-success';
  @Input() showLabelNo: string = 'true';
  @Output() confirm = new EventEmitter();
  @Output() close = new EventEmitter();

  constructor() { }

  executeConfirm() {
    this.confirm.emit(null);
    (<any>jQuery)('.modal').modal('hide');
  }

}
