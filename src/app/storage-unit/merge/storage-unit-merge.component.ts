import { StorageUnitMergeService } from './storage-unit-merge.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-storage-unit-merge',
  templateUrl: 'storage-unit-merge.component.html'
})

export class StorageUnitMergeComponent implements OnInit {
  constructor(
    private service: StorageUnitMergeService,
  ) { }

  ngOnInit() { }

  get batch() {
    return this.service.batch;
  }
}
