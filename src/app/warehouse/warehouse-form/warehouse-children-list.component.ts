import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-warehouse-children-list',
  templateUrl: './warehouse-children-list.component.html'
})
export class WarehouseChildrenListComponent implements OnInit {
  @Input() children;

  constructor() { }

  ngOnInit() { }
}
