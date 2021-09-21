import { EventEmitter } from '@angular/common/src/facade/async';
import { Component, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-confirm-inline',
  templateUrl: 'confirm-inline.component.html'
})

export class ConfirmInlineComponent implements OnInit {

  @Output() confirm = new EventEmitter<boolean>();
  confirmed: boolean = false;
  constructor() { }

  ngOnInit() { }

  confirmHandler(event: Event, confirmed: boolean) {
    event.stopPropagation();
    this.confirm.emit(confirmed);
    this.confirmed = confirmed;
  }
}
