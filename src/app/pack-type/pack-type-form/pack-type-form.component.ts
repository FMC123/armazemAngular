import { GenericType } from '../generic-type';
import { Masks } from '../../shared/forms/masks/masks';
import { ServiceItem } from '../../service-item/service-item';
import { ServiceItemService } from '../../service-item/service-item.service';
import { WarehouseService } from '../../warehouse/warehouse.service';
import { Warehouse } from '../../warehouse/warehouse';
import { ErrorHandler } from './../../shared/errors/error-handler';
import { Notification } from './../../shared/notification/notification';
import { PackType } from './../pack-type';
import { PackTypeService } from './../pack-type.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {ChecklistType} from "../../checklist/checklist-type";
import {ChecklistService} from "../../checklist/checklist.service";

@Component({
	selector: 'app-pack-type-form',
	templateUrl: './pack-type-form.component.html'
})
export class PackTypeFormComponent implements OnInit {
	packType: PackType;
	form: FormGroup;
	loading: boolean = false;
	items: Array<ServiceItem> = [];
	integerMask = Masks.integerMask;
	decimalMask = Masks.decimalMask;
	genericTypes = GenericType.list();
  checklistTypes: Array<ChecklistType> = [];

	get editing() {
		return !!this.packType && !!this.packType.id;
	}

	constructor(
		private route: ActivatedRoute,
		private router: Router,
		private formBuilder: FormBuilder,
		private packTypeService: PackTypeService,
		private itemService: ServiceItemService,
		private checklistService: ChecklistService,
		private errorHandler: ErrorHandler
	) {}

	ngOnInit() {
		Notification.clearErrors();

		this.itemService
			.list()
			.then(items => {
				this.items = items;
			})
			.catch(error => this.handleError(error));

		this.checklistService
      .listTypes()
      .then( res => {
        this.checklistTypes = res;
      });

		this.route.data.forEach((data: { packType: PackType }) => {
			this.packType = data.packType;
			this.buildForm();
		});
	}

	buildForm() {
		this.form = this.formBuilder.group({
			code: [this.packType.code || '', Validators.required],
			description: [this.packType.description || '', [Validators.required]],
			weightString: [this.packType.weightString || '', [Validators.required]],
			capacityString: [
				this.packType.capacityString || '',
				[Validators.required]
			],
			trackStock: [this.packType.trackStock || false, []],
			rentItemId: [
				this.packType.rentServiceItem ? this.packType.rentServiceItem.id : '' || '',
				[]
			],
			storageItemId: [
				this.packType.storageServiceItem ? this.packType.storageServiceItem.id : '' || '',
				[]
			],
      loadUnloadId: [
				this.packType.loadUnloadServiceItem ? this.packType.loadUnloadServiceItem.id : '' || '',
				[]
			],
			genericType: [this.packType.genericType || '', [Validators.required]],
      checklistTypeId: [this.packType.checklistType ? this.packType.checklistType.id : '', []],
		});
	}

	save() {
		Object.keys(this.form.controls).forEach(key => {
			this.form.controls[key].markAsDirty();
		});

		if (!this.form.valid) {
			return;
		}

		this.loading = true;

		this.packType.code = this.form.value.code;
		this.packType.description = this.form.value.description;
		this.packType.weightString = this.form.value.weightString;
		this.packType.capacityString = this.form.value.capacityString;
		this.packType.trackStock = this.form.value.trackStock;
		this.packType.rentServiceItem = new ServiceItem(this.form.value.rentItemId);
		this.packType.storageServiceItem = new ServiceItem(this.form.value.storageItemId);
		this.packType.loadUnloadServiceItem = new ServiceItem(this.form.value.loadUnloadId);
		this.packType.genericType = this.form.value.genericType;
		this.packType.checklistType = new ChecklistType(this.form.value.checklistTypeId);

		return this.packTypeService
			.save(this.packType)
			.then(() => {
				Notification.success('Embalagem salva com sucesso!');
				this.router.navigate(['/pack-type']);
			})
			.catch(error => this.handleError(error));
	}

	handleError(error) {
		this.loading = false;
		return this.errorHandler.fromServer(error);
	}
}
