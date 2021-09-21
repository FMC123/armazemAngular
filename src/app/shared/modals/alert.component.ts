import {Component, Input, Output, EventEmitter, HostListener} from '@angular/core';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html'
})

export class AlertComponent {
  @Input() message: string;
  @Input() title: string = "Alerta";
  @Input() okLabel: string;
  @Output() close = new EventEmitter();

  @HostListener("click", ["$event"])
  public onClick(event: any): void
  {
    event.stopPropagation();
  }

  constructor() { }

}
