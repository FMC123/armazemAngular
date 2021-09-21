import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-log-modal',
  templateUrl: './log-modal.component.html'
})
export class LogModalComponent implements OnInit {
  @Output() close: EventEmitter<void> = new EventEmitter<void>(false);
  @Input() title: string;

  constructor() {}

  ngOnInit() {}
}
