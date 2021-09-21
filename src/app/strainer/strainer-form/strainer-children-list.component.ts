import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-strainer-children-list',
  templateUrl: './strainer-children-list.component.html'
})
export class StrainerChildrenListComponent implements OnInit {
  @Input() children;

  constructor() { }

  ngOnInit() { }
}
