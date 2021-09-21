import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-harvest-season-children-list',
  templateUrl: './harvest-season-children-list.component.html'
})
export class HarvestSeasonChildrenListComponent implements OnInit {
  @Input() children;

  constructor() { }

  ngOnInit() { }
}
