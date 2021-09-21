import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-company-children-list',
  templateUrl: './company-children-list.component.html'
})
export class CompanyChildrenListComponent implements OnInit {
  @Input() companys;

  constructor() { }

  ngOnInit() { }
}
