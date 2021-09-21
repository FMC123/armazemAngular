import { Component, OnInit, Input } from '@angular/core';
import { Batch } from 'app/batch/batch';
import { BatchReportComponent } from '../batch-report.component';

@Component({
	selector: 'app-batch-report-remote',
	templateUrl: 'batch-report-remote.component.html'
})
export class BatchReportRemoteComponent implements OnInit {
	@Input() batch: Batch;
	@Input() parent: BatchReportComponent;

	title: string = "Lote Remoto";

	constructor(
	) { }

	ngOnInit() {}
}