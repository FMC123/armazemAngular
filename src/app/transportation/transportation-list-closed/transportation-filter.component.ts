import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { Batch } from '../../batch/batch';
import { Masks } from '../../shared/forms/masks/masks';
import { Transportation } from '../transportation';
import { TransportationFilter } from '../transportation-filter';
import { TransportationStatus } from '../transportation-status';
import { TransportationService } from '../transportation.service';

@Component({
	selector: 'app-transportation-filter',
	templateUrl: './transportation-filter.component.html'
})
export class TransportationFilterComponent implements OnInit {
	@Input() loading: boolean;
	@Output()
	filterChange: EventEmitter<TransportationFilter> = new EventEmitter<
		TransportationFilter
	>();

	form: FormGroup;

	filter: TransportationFilter = new TransportationFilter();
	dateMask = Masks.dateMask;
	integerMask = Masks.integerMask;

	constructor(
		private TransportationService: TransportationService,
		private formBuilder: FormBuilder,
		private route: ActivatedRoute
	) {}

	ngOnInit() {
		this.buildForm();
	}

	buildForm() {
		this.form = this.formBuilder.group({
			vehiclePlate1: [''],
			driverName: [''],
			arriveDateString: [''],
			fiscalNote: [''],
			sellCode: [''],
			batchCode: [''],
			batchOperationCode: ['']
		});
	}

	submit() {
		Object.keys(this.form.controls).forEach(key => {
			this.form.controls[key].markAsDirty();
		});
		if (!this.form.valid) {
			return;
		}
		this.filter = new TransportationFilter();
		this.filter.vehiclePlate1 = this.form.value.vehiclePlate1;
		this.filter.driverName = this.form.value.driverName;
		this.filter.arriveDateString = this.form.value.arriveDateString;
		this.filter.fiscalNote = this.form.value.fiscalNote;
		this.filter.sellCode = this.form.value.sellCode;
		this.filter.batchCode = this.form.value.batchCode;
		this.filter.batchOperationCode = this.form.value.batchOperationCode;
		this.filterChange.emit(this.filter);
	}

	get backLink() {
		let mode = this.route.snapshot.queryParams['mode'];

		if (mode === 'balance') {
			return ['/balance'];
		}

		if (mode === 'lobby') {
			return ['/lobby'];
		}

		return null;
	}
}
