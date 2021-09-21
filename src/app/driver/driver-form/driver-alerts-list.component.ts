import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-driver-alerts-list',
  templateUrl: './driver-alerts-list.component.html'
})
export class DriverAlertsListComponent implements OnInit {
  @Input() children;

  constructor() { }

  ngOnInit() { }
}
