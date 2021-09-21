import { Component, OnInit, Input } from '@angular/core';
import { Sample } from '../sample';
import { SampleHistoryService } from './sample-history.service';

@Component({
	selector: 'app-sample-history',
	templateUrl: 'sample-history.component.html'
})
export class SampleHistoryComponent implements OnInit {
	loading = false;
	@Input() sample: Sample;
	data: Sample[];

	constructor(private service: SampleHistoryService) {}

	ngOnInit() {
		this.loading = false;

		return this.service.listAll(this.sample.id).then(data => {
			this.data = data;
		});
	}
}
