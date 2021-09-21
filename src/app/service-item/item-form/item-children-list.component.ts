import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-item-children-list',
  templateUrl: './item-children-list.component.html'
})
export class ItemChildrenListComponent implements OnInit {
  @Input() children;

  constructor() { }

  ngOnInit() { }
}
