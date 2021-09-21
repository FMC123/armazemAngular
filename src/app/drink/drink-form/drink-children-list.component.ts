import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-drink-children-list',
  templateUrl: './drink-children-list.component.html'
})
export class DrinkChildrenListComponent implements OnInit {
  @Input() children;

  constructor() { }

  ngOnInit() { }
}
