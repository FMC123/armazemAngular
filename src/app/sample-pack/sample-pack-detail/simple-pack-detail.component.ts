import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Notification } from './../../shared/notification/notification';
import { Warehouse } from '../../warehouse/warehouse';
import { WarehouseService } from '../../warehouse/warehouse.service';
import { SamplePack } from '../sample-pack';
import { SamplePackService } from '../sample-pack.service';
import { ErrorHandler } from 'app/shared/errors/error-handler';
import { Http } from '@angular/http';
import { Sample } from '../../sample/sample';
import { SampleService } from '../../sample/sample.service';

@Component({
	selector: 'app-sample-pack-detail',
	templateUrl: './simple-pack-detail.component.html'
})
export class SamplePackDetailComponent implements OnInit {
	samplePack: SamplePack;
	loading: boolean = false;
	submitted: boolean = false;
	listSamples: Array<Sample>;

	constructor(
		private errorHandler: ErrorHandler,
		private route: ActivatedRoute,
		private router: Router,
		private formBuilder: FormBuilder,
		private samplePackService: SamplePackService,
		private sampleService: SampleService,
		private warehouseService: WarehouseService
	) {}

	ngOnInit() {
		Notification.clearErrors();

		this.route.data.forEach((data: { samplePack: SamplePack }) => {
			this.samplePack = data.samplePack;
		});

		this.findSamples();
	}

	findSamples() {
		this.sampleService
			.listAll(this.samplePack.id)
			.then(list => {
				this.listSamples = list;
			})
			.catch(error => this.handleError(error));
	}

	handleError(error) {
		this.loading = false;
		return this.errorHandler.fromServer(error);
	}
}
