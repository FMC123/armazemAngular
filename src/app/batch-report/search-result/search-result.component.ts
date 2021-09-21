import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {Batch} from "../../batch/batch";

@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html'
})
export class SearchResultComponent implements OnInit {
  @Input() batch : Batch;

  constructor() {
  }

  ngOnInit() {}

}
