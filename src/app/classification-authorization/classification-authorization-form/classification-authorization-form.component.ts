import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import {
	AbstractControl,
	FormBuilder,
	FormGroup,
	Validators,
	ValidatorFn,
	FormControl
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { Masks } from '../../shared/forms/masks/masks';
import { ErrorHandler } from './../../shared/errors/error-handler';
import { Notification } from './../../shared/notification/notification';

import { ClassificationAuthorizationService } from '../classification-authorization.service';
import { ClassificationVersion } from '../../classification/classification-version';
import { ClassificationItem } from '../../classification/classification-item';
import { ClassificationType } from '../../classification/classification-type';
import { Sample } from '../../sample/sample';
import { User } from '../../user/user';

import { UserService } from '../../user/user.service';
import { DateTimeHelper } from '../../shared/globalization';
import { AuthService } from '../../auth/auth.service';
import { CertificateService } from 'app/certificate/certificate.service';
import { Certificate } from 'app/certificate/certificate';

@Component({
	selector: 'app-classification-authorization-form',
	templateUrl: './classification-authorization-form.component.html'
})
export class ClassificationAuthorizationFormComponent
	implements OnInit, OnDestroy {
	users: Array<User> = [];
	classificationVersion: ClassificationVersion;
	todayString = DateTimeHelper.toDDMMYYYY(new Date().getTime());

	itemsDirty = false;
	submitted = false;
	integerMask = Masks.integerMask;
	decimalMask = Masks.decimalMask;
	dateMask: any = Masks.dateMask;
	form: FormGroup;
	loading = false;
	oldItens: Array<ClassificationItem>;

	constructor(
		private route: ActivatedRoute,
		private router: Router,
		private formBuilder: FormBuilder,
		private classificationAuthorizationService: ClassificationAuthorizationService,
		private userService: UserService,
		private errorHandler: ErrorHandler,
		private auth: AuthService,
		private certificateService: CertificateService
	) { }

	ngOnInit() {
		Notification.clearErrors();
		this.userService
			.list()
			.then(users => {
				this.users = users;
			})
			.catch(error => this.errorHandler.fromServer(error));

		this.route.data.forEach(
			(data: { classificationVersion: ClassificationVersion }) => {
				this.classificationVersion = data.classificationVersion;
				this.buildForm();
			}
		);
		this.oldItens = this.classificationVersion.items;
		this.setComboValues();
	}

	ngOnDestroy() { }

	buildForm() {
		this.itemsDirty = false;
		this.form = this.formBuilder.group({
			updateType: new FormControl('', Validators.required),
			barcode: [
				this.classificationVersion.sample
					? this.classificationVersion.sample.barcode || ''
					: '',
				[Validators.required]
			],
			version: [
				{
					value: this.classificationVersion
						? this.classificationVersion.version || '1'
						: '1',
					disabled: true
				},
				[Validators.required]
			],
			classificationDate: [
				this.classificationVersion
					? this.classificationVersion.classificationDateString || ''
					: '',
				[Validators.required, this.dateValidator()]
			],
			classifiedBy: [
				this.classificationVersion
					? this.classificationVersion.classifiedBy || ''
					: '',
				[Validators.required]
			],
			tastedBy: [
				this.classificationVersion
					? this.classificationVersion.tastedBy || ''
					: '',
				[Validators.required]
			],
			tastedAgain1By: [
				this.classificationVersion
					? this.classificationVersion.tastedAgain1By || ''
					: '',
				[]
			],
			tastedAgain2By: [
				this.classificationVersion
					? this.classificationVersion.tastedAgain2By || ''
					: '',
				[]
			],
			tastedAgain3By: [
				this.classificationVersion
					? this.classificationVersion.tastedAgain3By || ''
					: '',
				[]
			],
			observation: [
				this.classificationVersion
					? this.classificationVersion.observation || ''
					: '',
				[]
			]
		});
	}

	save() {
		Notification.clearErrors();
		this.submitted = true;

		Object.keys(this.form.controls).forEach(key => {
			this.form.controls[key].markAsDirty();
		});

		if (!this.form.valid) {
			return;
		}

		if (!this.hasChanged() && this.updateType.value === 'modifiedAuthorized') {
			Notification.error(
				'É necessário fazer alguma alteração na classificação!'
			);
			return;
		}

		this.loading = true;

		this.classificationVersion.version = this.form.value.version;
		this.classificationVersion.classificationDateString = this.form.value.classificationDate;

		this.classificationVersion.classifiedBy = new User(
			this.form.value.classifiedBy
		);

		this.classificationVersion.tastedBy = new User(this.form.value.tastedBy);
		this.classificationVersion.tastedAgain1By = new User(
			this.form.value.tastedAgain1By
		);

		this.classificationVersion.tastedAgain2By = new User(
			this.form.value.tastedAgain2By
		);

		this.classificationVersion.tastedAgain3By = new User(
			this.form.value.tastedAgain3By
		);

		this.classificationVersion.observation = this.form.value.observation;

		this.classificationVersion.analyzedDate = new Date().getTime();

		let authorized = this.updateType.value === 'authorized' || this.updateType.value === 'modifiedAuthorized';
		let modifiedAuthorized = this.updateType.value === 'modifiedAuthorized';
		this.classificationVersion.authorized = authorized;

		if (modifiedAuthorized) {
			return this.classificationAuthorizationService
				.saveVersion(this.classificationVersion)
				.then(() => {
					Notification.success('Versão de classificação salva com sucesso!');
					this.loading = false;
					this.reset();
					this.router.navigate(['/classification-authorization']);
				})
				.catch(error => this.handleError(error));

		} else {
			return this.classificationAuthorizationService
				.updateStatus(this.classificationVersion)
				.then(() => {

					if (authorized) {
						Notification.success(
							'Versão de classificação autorizada com sucesso!'
						);
					} else {
						Notification.success(
							'Versão de classificação desautorizada com sucesso!'
						);
					}

					this.loading = false;
					this.reset();
					this.router.navigate(['/classification-authorization']);
				})
				.catch(error => this.handleError(error));
		}
	}

	reset() {
		this.submitted = false;
		this.classificationVersion = ClassificationVersion.fromData();
		this.classificationVersion.sample = new Sample();
		this.form = null;
		setTimeout(() => {
			this.buildForm();
		}, 0);
	}

	dateValidator(): ValidatorFn {
		return (control: AbstractControl): { [key: string]: any } => {
			if (!this.classificationVersion) {
				return null;
			}
			const today = new Date();

			const value = new Date(DateTimeHelper.fromDDMMYYYY(control.value));
			if (!value) return;
			if (value > today) {
				return {
					dateLessThan: {
						requiredValue: DateTimeHelper.toDDMMYYYY(today.getTime()),
						actualValue: value
					}
				};
			}
			return null;
		};
	}

	handleError(error) {
		this.loading = false;
		return this.errorHandler.fromServer(error);
	}

	get updateType() {
		return this.form.get('updateType');
	}

	setComboValues() {

		if (this.form.value.classifiedBy != null) {
			this.form.get('classifiedBy').setValue(this.form.value.classifiedBy.id);
		}

		if (this.form.value.tastedBy != null) {
			this.form.get('tastedBy').setValue(this.form.value.tastedBy.id);
		}

		if (this.form.value.tastedAgain1By != null) {
			this.form.get('tastedAgain1By').setValue(this.form.value.tastedAgain1By.id);
		}

		if (this.form.value.tastedAgain2By) {
			this.form.get('tastedAgain2By').setValue(this.form.value.tastedAgain2By.id);
		}

		if (this.form.value.tastedAgain3By) {
			this.form.get('tastedAgain3By').setValue(this.form.value.tastedAgain3By.id);
		}

		this.oldItens = this.classificationVersion.items;
	}

	get submitButtonClass() {
		if (!this.form) {
			return 'btn btn-success';
		}

		const value = this.form.value.updateType;

		switch (value) {
			case 'authorized':
				return 'btn btn-success';
			case 'unauthorized':
				return 'btn btn-danger';
			case 'modifiedAuthorized':
				return 'btn btn-warning';
		}

		return 'btn btn-success';
	}

	get submitButtonLabel() {
		if (!this.form) {
			return 'SALVAR';
		}

		const value = this.form.value.updateType;

		switch (value) {
			case 'authorized':
				return 'AUTORIZAR';
			case 'unauthorized':
				return 'NÃO AUTORIZAR';
			case 'modifiedAuthorized':
				return 'AUTORIZAR (COM MODIFICAÇÕES)';
		}

		return 'SALVAR';
	}

	hasChanged() {
		if (
			this.itemsDirty ||
			(this.classificationVersion.classifiedBy != null
				&& this.classificationVersion.classifiedBy.id !==
				this.form.value.classifiedBy) ||
			(this.classificationVersion.tastedBy != null
				&& this.classificationVersion.tastedBy.id !== this.form.value.tastedBy) ||
			(this.classificationVersion.tastedAgain1By != null
				&& this.classificationVersion.tastedAgain1By.id !==
				this.form.value.tastedAgain1By) ||
			(this.classificationVersion.tastedAgain2By != null
				&& this.classificationVersion.tastedAgain2By.id !==
				this.form.value.tastedAgain2By) ||
			(this.classificationVersion.tastedAgain3By != null
				&& this.classificationVersion.tastedAgain3By.id !==
				this.form.value.tastedAgain3By) ||
			this.classificationVersion.observation !== this.form.value.observation
		) {
			return true;
		} else {
			return false;
		}
	}

	/**
	 * Recupera URL do certificado
	 * 
	 * @param certificate 
	 */
	getUrlCertificate(certificate: Certificate) {
		this.certificateService.fillImageURL(certificate);
		return certificate.url;
	}
}