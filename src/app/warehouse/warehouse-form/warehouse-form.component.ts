import { Person } from '../../person/person';
import { Masks } from './../../shared/forms/masks/masks';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { City } from '../../city/city';
import { Country } from '../../country/country';
import { Uf } from '../../uf/uf';
import { Notification } from './../../shared/notification/notification';
import { Warehouse } from './../warehouse';
import { WarehouseService } from './../warehouse.service';

import { UfService } from '../../uf/uf.service';
import { CityService } from '../../city/city.service';
import { CountryService } from '../../country/country.service';
import { ErrorHandler } from '../../shared/shared.module';

@Component({
	selector: 'app-warehouse-form',
	templateUrl: './warehouse-form.component.html'
})
export class WarehouseFormComponent implements OnInit {
	parents: Array<Warehouse>;
	warehouse: Warehouse;
	form: FormGroup;
	loading: boolean = false;

	postalCodeMask = Masks.postalCodeMask;
	cnpjMask = Masks.cnpjMask;

	submitted: boolean = false;

	decimalMask: any = Masks.decimalMask;
	constructor(
		private route: ActivatedRoute,
		private router: Router,
		private formBuilder: FormBuilder,
		private warehouseService: WarehouseService,
		private cityService: CityService,
		private ufService: UfService,
		private countryService: CountryService,
		private errorHandler: ErrorHandler
	) {}

	ngOnInit() {
		Notification.clearErrors();
		this.route.data.forEach((data: { warehouse: Warehouse }) => {
			this.warehouse = data.warehouse;
			this.warehouseService.listParentCandidates().then(warehouses => {
				this.parents = warehouses.filter(w => w.id !== this.warehouse.id);
			});

			this.buildForm();
		});
	}

	buildForm() {
		this.form = this.formBuilder.group({
			name: [this.warehouse.name || '', [Validators.required]],
			code: [
				this.warehouse.code || '',
				[Validators.required, Validators.pattern('[a-zA-Z0-9]+')]
			],
			shortName: [
				this.warehouse.shortName || '',
				[Validators.required, Validators.pattern('[a-zA-Z0-9]+')]
			],
			stackWeightLimitString: [this.warehouse.stackWeightLimitString || ''],
			axCode: [this.warehouse.axCode || ''],
			storageTypeBigBag: [this.warehouse.storageTypeBigBag || false],
			storageTypeSacaria: [this.warehouse.storageTypeSacaria || false],
			storageTypeSilo: [this.warehouse.storageTypeSilo || false],
      matriz: [this.warehouse.matriz || false],
      ipAddress: [this.warehouse.ipAddress || ''],
      local: [this.warehouse.local || false],
			parentId: [this.warehouse.parent ? this.warehouse.parent.id : ''],
			personId: [
				this.warehouse.person ? this.warehouse.person.id || '' : '']
		});
	}

	save() {
		this.submitted = true;
		Object.keys(this.form.controls).forEach(key => {
			this.form.controls[key].markAsDirty();
		});

		if (!this.form.valid) {
			return;
		}

		this.loading = true;
		this.warehouse.name = this.form.value.name;
		this.warehouse.axCode = this.form.value.axCode;
		this.warehouse.shortName = this.form.value.shortName.toUpperCase();
		this.warehouse.code = this.form.value.code.toUpperCase();
		this.warehouse.stackWeightLimitString = this.form.value.stackWeightLimitString;
		this.warehouse.storageTypeBigBag = this.form.value.storageTypeBigBag;
		this.warehouse.storageTypeSacaria = this.form.value.storageTypeSacaria;
		this.warehouse.storageTypeSilo = this.form.value.storageTypeSilo;
		this.warehouse.matriz = this.form.value.matriz;
    this.warehouse.ipAddress = this.form.value.ipAddress;
    this.warehouse.local = this.form.value.local;


		if (this.form.value.parentId) {
			this.warehouse.parent = new Warehouse();
			this.warehouse.parent.id = this.form.value.parentId;
		} else {
			this.warehouse.parent = null;
		}

		if(this.form.value.personId) {			
			this.warehouse.person = new Person();
			this.warehouse.person.id = this.form.value.personId;
		}

		this.warehouseService
			.save(this.warehouse)
			.then(() => {
				Notification.success('Armazém salvo com sucesso!');
				this.router.navigate(['/warehouse']);
			})
			.catch(error => this.handleError(error));
	}

	handleError(error) {
		this.loading = false;
		return this.errorHandler.fromServer(error);
	}
}
