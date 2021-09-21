import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Notification } from '../../../shared/notification/notification';
import { Sample } from '../../../sample/sample';
import {SampleListFilter} from "../../../sample/sample-list/sample-list-filter";

@Component({
	selector: 'app-sample-movements',
	templateUrl: './sample-movements.component.html'
})
export class SampleMovementsComponent implements OnInit {
	sample: Sample;
  filter: any;
	constructor(private route: ActivatedRoute) {}

	ngOnInit() {
		Notification.clearErrors();
		this.route.data.forEach((data: { sample: Sample }) => {
			this.sample = data.sample;
      this.filter = this.route.params['filter'];
		});
	}
}
