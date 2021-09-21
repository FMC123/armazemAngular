import { SampleTrackingService } from './sample-tracking.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { SampleTrackingBatchesService } from './sample-tracking-batches.service';
import {Batch} from "../batch/batch";

@Component({
	selector: 'app-tracking',
	templateUrl: 'sample-tracking.component.html',
  providers: [SampleTrackingBatchesService]
})
export class SampleTrackingComponent implements OnInit, OnDestroy {

	constructor(private batchesService: SampleTrackingBatchesService) {}

	ngOnInit() {}

	ngOnDestroy() {}
}
