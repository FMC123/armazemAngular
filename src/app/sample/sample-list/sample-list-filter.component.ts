import { ErrorHandler } from '../../shared/errors/error-handler';
import {
	Component,
	EventEmitter,
	Input,
	OnInit,
	Output
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { SampleListFilter } from './sample-list-filter';
import { Warehouse } from '../../warehouse/warehouse';
import { WarehouseService } from '../../warehouse/warehouse.service';
import { Department } from 'app/department/department';
import { DepartmentService } from 'app/department/department.service';

@Component({
	selector: 'app-sample-list-filter',
	templateUrl: 'sample-list-filter.component.html'
})
export class SampleListFilterComponent implements OnInit {
	@Input() loading: boolean;
	@Output()
	filterChange: EventEmitter<SampleListFilter> = new EventEmitter<SampleListFilter>();

	form: FormGroup;
	filter: SampleListFilter = new SampleListFilter();
	warehouses: Warehouse[];
	departments: Department[];
	// tipos para café especial
	coffeeTypes = [];

	constructor(
		private formBuilder: FormBuilder,
		private warehouseService: WarehouseService,
		private departmentService: DepartmentService
	) {
		this.coffeeTypes.push({ value: 'Sim', name: 'Especial' });
		this.coffeeTypes.push({ value: 'Não', name: 'Normal' });
		this.coffeeTypes.push({ value: 'Ambos', name: 'Ambos' });
	}

	ngOnInit() {
		this.warehouseService.list().then(warehouses => {
			this.warehouses = warehouses;
		});

		this.departmentService.list().then(departments => {
			this.departments = departments;
		});

		this.buildForm();
	}

	buildForm() {
		this.form = this.formBuilder.group({
			barcode: [''],
			reservation: [''],
			batchCode: [''],
			warehouseId: [''],
			departmentId: [''],
			includeNotInStock: [false],
			indicationSpecialCoffee: ['']
		});
	}

	submit() {
		Object.keys(this.form.controls).forEach(key => {
			this.form.controls[key].markAsDirty();
		});

		if (!this.form.valid) {
			return;
		}

		this.filter = SampleListFilter.fromData(this.form.value);
		this.filterChange.emit(this.filter);
	}
}
