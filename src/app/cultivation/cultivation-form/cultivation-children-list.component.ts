import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-cultivation-children-list',
  templateUrl: './cultivation-children-list.component.html'
})
export class CultivationChildrenListComponent implements OnInit {
  @Input() children;

  constructor() { }

  ngOnInit() { }
}
