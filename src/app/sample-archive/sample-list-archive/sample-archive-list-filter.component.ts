import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Department } from "../../department/department";
import { DepartmentService } from "../../department/department.service";
import { SampleListFilter } from "../../sample/sample-list/sample-list-filter";
import { ErrorHandler } from '../../shared/errors/error-handler';
import { Warehouse } from '../../warehouse/warehouse';
import { WarehouseService } from '../../warehouse/warehouse.service';


@Component({
	selector: 'app-sample-archive-list-filter',
	templateUrl: 'sample-archive-list-filter.component.html'
})
export class SampleArchiveListFilterComponent implements OnInit {
	@Input() loading: boolean;
	@Output() filterChange: EventEmitter<SampleListFilter> = new EventEmitter<SampleListFilter>();

	form: FormGroup;
	filter: SampleListFilter = new SampleListFilter();
	warehouses: Warehouse[];
	departments: Department[];
	// tipos para café especial
	coffeeTypes = [];

	constructor(
		private formBuilder: FormBuilder,
		private route: ActivatedRoute,
		private errorHandler: ErrorHandler,
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
		this.filter.onlyArchived = false;
		this.filterChange.emit(this.filter);
	}
}
