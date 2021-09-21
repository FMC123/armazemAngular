import { collaboratorType } from '../type-collaborator';
import { Person } from '../../person/person';
import { ModalManager } from '../../shared/modals/modal-manager';
import { Masks } from '../../shared/forms/masks/masks';
import { Subscription } from 'rxjs/Rx';
import { City } from '../../city/city';
import { Uf } from '../../uf/uf';
import { Country } from '../../country/country';
import { CityService } from '../../city/city.service';
import { UfService } from '../../uf/uf.service';
import { CountryService } from '../../country/country.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validator, Validators } from '@angular/forms';

import { Notification } from './../../shared/notification/notification';
import { Warehouse } from '../../warehouse/warehouse';
import { Collaborator } from '../collaborator';
import { CollaboratorService } from '../collaborator.service';
import { WarehouseService } from '../../warehouse/warehouse.service';

@Component({
	selector: 'collaborator-form',
	templateUrl: './collaborator-form.component.html'
})
export class CollaboratorFormComponent implements OnInit {
	warehouses: Array<Warehouse>;
	collaborator: Collaborator;
	form: FormGroup;
	loading: boolean = false;
	ufs: Array<Uf>;
	countrys: Array<Country>;
	citys: Array<City>;
	submitted: boolean = false;
	ufSubscription: Subscription;
	rgMask = Masks.rgMask;
	cpfMask = Masks.cpfMask;
	cnpjMask = Masks.cnpjMask;
	zipCodeMask = Masks.postalCodeMask;
	phoneMask = Masks.phoneMask;
	integerMask = Masks.integerMask;
	dateMask = Masks.dateMask;
	personModalManager = new ModalManager();

	constructor(
		private route: ActivatedRoute,
		private router: Router,
		private formBuilder: FormBuilder,
		private collaboratorService: CollaboratorService,
		private warehouseService: WarehouseService,
		private countryService: CountryService,
		private cityService: CityService,
		private ufService: UfService
	) {}

	ngOnInit() {
		Notification.clearErrors();
		this.route.data.forEach((data: { collaborator: Collaborator }) => {
			this.collaborator = data.collaborator;
			this.buildForm();
		});
		this.countryService.list().then((countrys: Array<Country>) => {
			this.countrys = countrys;
		});
		this.ufService.list().then((ufs: Array<Uf>) => {
			this.ufs = ufs;
		});
		this.cityService.list().then((citys: Array<City>) => {
			this.citys = citys;
		});
	}

	get pessoaFisica() {
		return this.form.get('personType').value === '1';
	}

	get pessoaJuridica() {
		return this.form.get('personType').value === '2';
	}

	buildForm() {
		this.form = this.formBuilder.group({
			initialQuota: [this.collaborator.initialQuota || '', [Validators.required]],
			admissionDateString: [
				this.collaborator.admissionDateString || '',
				[Validators.required]
			],
			dateDisconnectionString: [this.collaborator.dateDisconnectionString || ''],
			observation: [this.collaborator.observation || ''],
			registration: [this.collaborator.registration || ''],
			personId: [
				this.collaborator.person ? this.collaborator.person.id || '' : '',
				[Validators.required]
			]
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

		this.collaborator.initialQuota = this.form.value.initialQuota;
		this.collaborator.admissionDateString = this.form.value.admissionDateString;
		this.collaborator.dateDisconnectionString = this.form.value.dateDisconnectionString;
		this.collaborator.observation = this.form.value.observation;
		this.collaborator.collaboratorType = collaboratorType.COOPERATED.code;
		this.collaborator.person = new Person();
		this.collaborator.person.id = this.form.value.personId;

		this.collaboratorService.save(this.collaborator).then(collaborator => {
			Notification.success('Cooperado salvo com sucesso!');
			this.router.navigate(['/collaborator']);
		}).catch(x => {
      (this.loading = false),
      Notification.error(`Erro ao cadastrar, verifique os campos informados`);

    });
	}

	/*  selectPerson(person: Person) {
    alert(person.name);
  } */
}
