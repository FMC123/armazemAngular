import { Batch } from '../batch';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-batch-detail-simple',
  templateUrl: 'batch-detail-simple.component.html'
})

export class BatchDetailSimpleComponent implements OnInit {
  @Input() batch: Batch;
  constructor() { }

  ngOnInit() {}
}
