import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-carrier-children-list',
  templateUrl: './carrier-children-list.component.html'
})
export class CarrierChildrenListComponent implements OnInit {
  @Input() children;

  constructor() { }

  ngOnInit() { }
}
