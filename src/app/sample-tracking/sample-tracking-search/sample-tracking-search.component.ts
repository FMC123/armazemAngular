import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ClassificationFormHelper } from '../../classification/classification-form-helper';
import { ClassificationType } from '../../classification/classification-type';
import { ClassificationService } from '../../classification/classification.service';
import { CollaboratorAutocomplete } from '../../collaborator/collaborator-autocomplete';
import { CollaboratorService } from '../../collaborator/collaborator.service';
import { Masks } from '../../shared/forms/masks/masks';
import { ErrorHandler } from '../../shared/shared.module';
import { Warehouse } from '../../warehouse/warehouse';
import { WarehouseService } from '../../warehouse/warehouse.service';
import { SampleTrackingBatchesService } from '../sample-tracking-batches.service';
import { SampleTrackingService } from '../sample-tracking.service';
import { CertificateService } from '../../certificate/certificate.service';
import { Certificate } from '../../certificate/certificate';

@Component({
	selector: 'app-sample-tracking-search',
	templateUrl: 'sample-tracking-search.component.html'
})
export class SampleTrackingSearchComponent implements OnInit, OnDestroy {
	loading: boolean = false;
	form: FormGroup;
	warehouses: Array<Warehouse>;
	certificates: Array<Certificate>;
	classificationTypes: Array<ClassificationType>;
	collaboratorAutocomplete: CollaboratorAutocomplete;
	collaboratorSubscription: Subscription;
	integerMask: any = Masks.unlimitedDecimalMask;

	constructor(
		private SampleTrackingService: SampleTrackingService,
		public batchesService: SampleTrackingBatchesService,
		private formBuilder: FormBuilder,
		private warehouseService: WarehouseService,
		private errorHandler: ErrorHandler,
		private collaboratorService: CollaboratorService,
		private classificationService: ClassificationService,
		private certificateService: CertificateService
	) {}

	ngOnInit() {
		this.collaboratorAutocomplete = new CollaboratorAutocomplete(
			this.collaboratorService,
			this.errorHandler
		);

		this.warehouseService.list().then(wareshouses => {
			this.warehouses = wareshouses;
		});

		this.certificateService.listWithoutImage().then(certificates => {
			this.certificates = certificates;
		});

		this.classificationService.listTypes().then(classificationTypes => {
			this.classificationTypes = classificationTypes;
			this.buildForm();
		});
	}

	ngOnDestroy() {
		if (
			this.collaboratorSubscription != null &&
			!this.collaboratorSubscription.closed
		) {
			this.collaboratorSubscription.unsubscribe();
		}
	}

	buildForm() {
		const formGroup = {
			warehouseId: [''],
			collaboratorId: [''],
			certificationId: [''],
			ckbCafe: [false],
			ckbContaminant: [false],
			ckbLT: [false],
			ckbPE: [false],
			ckbOR: [false],
			ckbIncluirReservados: [false]
		};

		ClassificationFormHelper.attachToForm(formGroup, this.classificationTypes);
		this.form = this.formBuilder.group(formGroup);

		this.collaboratorSubscription = this.collaboratorAutocomplete.valueChange.subscribe(
			value => {
				const id = value ? value.id : null;
				this.form.get('collaboratorId').setValue(id);
			}
		);
	}

	search() {
		this.loading = true;
		const formValue = this.form.value;
		formValue.classifications = ClassificationFormHelper.mapFormValueTypesToList(
			formValue,
			this.classificationTypes
		);

		console.log(formValue);

		this.SampleTrackingService.search(formValue).then(samples => {
			this.batchesService.changeSamples(samples);
			this.loading = false;
		}).catch(error => this.handleError(error));
	}

	cleanForm() {
		this.buildForm();
	}

	get classificationTypesInterval() {
		return this.classificationTypes.filter(ct => ct.type === 'INTERVAL');
	}

	get classificationTypesEnumerator() {
		return this.classificationTypes.filter(ct => ct.type === 'ENUMERATOR');
	}

	handleError(error) {
		this.loading = false;
		return this.errorHandler.fromServer(error);
	}
}
