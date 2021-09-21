import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Notification } from './../../shared/notification/notification';
import { Sample } from '../sample';

@Component({
	selector: 'app-sample-details',
	templateUrl: './sample-details.component.html'
})
export class SampleDetailsComponent implements OnInit {
	sample: Sample;

	constructor(private route: ActivatedRoute) {}

	ngOnInit() {
		Notification.clearErrors();
		this.route.data.forEach((data: { sample: Sample }) => {
			this.sample = data.sample;
		});
	}
}
