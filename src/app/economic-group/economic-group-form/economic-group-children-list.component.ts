import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-economic-group-children-list',
  templateUrl: './economic-group-children-list.component.html'
})
export class EconomicGroupChildrenListComponent implements OnInit {
  @Input() children;

  constructor() { }

  ngOnInit() { }
}
