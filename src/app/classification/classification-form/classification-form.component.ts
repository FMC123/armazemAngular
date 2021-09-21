import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import {
	AbstractControl,
	FormBuilder,
	FormGroup,
	Validators,
	ValidatorFn
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { Masks } from '../../shared/forms/masks/masks';
import { ErrorHandler } from '../../shared/errors/error-handler';
import { Notification } from '../../shared/notification';

import { ClassificationVersion } from '../classification-version';
import { ClassificationItem } from '../classification-item';
import { ClassificationType } from '../classification-type';
import { User } from '../../user/user';

import { UserService } from '../../user/user.service';
import { ClassificationService } from '../classification.service';
import { DateTimeHelper } from '../../shared/globalization';
import { Observable } from 'rxjs/Observable';
import { SampleService } from '../../sample/sample.service';
import { Sample } from '../../sample/sample';
import { forEach } from '@angular/router/src/utils/collection';
import { ClassificationRequirementItem } from "../classification-requirement-item";
import { ViewChild } from '@angular/core';
import { ClassificationItemFormComponent } from './classification-item-form.component';
import { AuthService } from '../../auth/auth.service';
import {ParameterService} from "../../parameter/parameter.service";
import {SampleFilterAutocomplete} from "../../sample/sample-filter-autocomplete";
import {Batch} from "../../batch/batch";

@Component({
	selector: 'app-classification-form',
	templateUrl: './classification-form.component.html'
})
export class ClassificationFormComponent implements OnInit, OnDestroy {
	@ViewChild(ClassificationItemFormComponent) classificationItemFormComponent: ClassificationItemFormComponent;

	users: Array<User> = [];
	classificationVersion: ClassificationVersion;
	barcodeDatasource: Observable<Array<String>>;
	sampleAutocomplete: SampleFilterAutocomplete;
  sampleSubscription: Subscription;
  batches: Array<Batch>;

	submitted = false;
	integerMask = Masks.integerMask;
	decimalMask = Masks.decimalMask;
	dateMask: any = Masks.dateMask;
	form: FormGroup;
	loading = false;
	isIndication = false;
	invalidBarcode = false;
	isShowItemOwner = false;
	/**
	 * Indicativo para classificação de café especial
	 */
	specialCoffee: boolean = false;
	/**
	 * Código de barras vinda da URL, para novo café especial
	 */
	barcode: string = '';

  blindClassification: boolean;

	requirementItems: Array<ClassificationRequirementItem> = [];

	constructor(
		private route: ActivatedRoute,
		private router: Router,
		private formBuilder: FormBuilder,
		private classificationService: ClassificationService,
		private userService: UserService,
		private sampleService: SampleService,
		private errorHandler: ErrorHandler,
		private authService: AuthService,
    private parameterService: ParameterService
	) { }

	ngOnInit() {
		Notification.clearErrors();
    this.blindClassification = this.authService.findParameterBoolean("BLIND_CLASSIFICATION");

    this.sampleAutocomplete = new SampleFilterAutocomplete(this.sampleService, this.errorHandler);
    this.sampleSubscription = this.sampleAutocomplete.valueChange.subscribe((value) => {
      this.form.get('barcode').setValue( value ? value : null);
      this.barcode = value;

      this.batches = [];
      this.sampleService.findByBarCode(value).then(sample =>{
        this.batches = sample.batches;
      }).catch();

      this.onBlurMethod(value);
    });

		this.userService
			.listClassifiers()
			.then(users => {
				this.users = users;
			})
			.catch(error => this.errorHandler.fromServer(error));

		this.route.data.forEach((data: { classification: ClassificationVersion }) => {

			this.classificationVersion = data.classification;

			if (this.classificationVersion && this.classificationVersion.id && this.classificationVersion.version) {
				this.classificationVersion.version++;
			}

			if (!this.classificationVersion || !this.classificationVersion.listRequirementItem) {
				this.classificationService.getRequirements().then((res) => {
					this.requirementItems = res;
				}).catch();
			}

			this.buildForm();

			this.barcodeDatasource = Observable.create((observer: any) => {
				observer.next(this.form.get('barcode').value);

			}).mergeMap(value => {
				return Observable.fromPromise(this.sampleService.search(value, false))
			});
		});

		this.onBlurMethod(this.form.get('barcode').value);
		this.setDefaultClassifier();

		// parâmetros
		this.route.queryParams.subscribe(params => {

			if (params['specialCoffee'] != null && params['specialCoffee'] == 'true') {
				this.specialCoffee = true;
			}

			if (params['barcode'] != null && params['barcode'] != '') {
				this.barcode = params['barcode'];
			}

			this.buildForm();
		});
	}

	onBlurMethod(value: string) {
	  if(
	    !value ||
      ( value.length < 30 && value.length > 0 && this.blindClassification )
    ) {
        this.invalidBarcode = true;
        return;
	  }

		this.classificationService.nextVersionByBarcode(value).then(nextVersion => {

			this.invalidBarcode = false;

			if (!this.classificationVersion) {
				this.classificationVersion = new ClassificationVersion();
			}

			if (!this.classificationVersion.sample) {
				this.classificationVersion.sample = new Sample();
			}

			this.classificationVersion.version = nextVersion;
			this.classificationVersion.sample.barcode = value;
			this.buildForm();

		}).catch(error => {
			this.invalidBarcode = true;
			this.handleError(error);
			this.buildForm();
		});
	}

	ngOnDestroy() { }

	buildForm() {

		let barcode = (this.barcode)
			? this.barcode
			: this.classificationVersion && this.classificationVersion.sample
				? this.classificationVersion.sample.barcode || ''
				: '';

		this.form = this.formBuilder.group({
			barcode: [
				{
					value: barcode,
					disabled: !!this.classificationVersion.id || this.specialCoffee
				},
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
					? this.classificationVersion.classificationDateString || DateTimeHelper.toDDMMYYYY(moment()) : DateTimeHelper.toDDMMYYYY(moment()) ,
				[Validators.required, this.dateValidator()]
			],
			classifiedBy: [
				this.classificationVersion && this.classificationVersion.classifiedBy
					? this.classificationVersion.classifiedBy.id || '' : '',
				[Validators.required]
			],
			tastedBy: [
				this.classificationVersion && this.classificationVersion.tastedBy
					? this.classificationVersion.tastedBy.id || '' : '',
				[Validators.required]
			],
			tastedAgain1By: [
				this.classificationVersion && this.classificationVersion.tastedAgain1By
					? this.classificationVersion.tastedAgain1By.id || '' : '',
				[]
			],
			tastedAgain2By: [
				this.classificationVersion && this.classificationVersion.tastedAgain2By
					? this.classificationVersion.tastedAgain2By.id || '' : '',
				[]
			],
			tastedAgain3By: [
				this.classificationVersion && this.classificationVersion.tastedAgain3By
					? this.classificationVersion.tastedAgain3By.id || '' : '',
				[]
			],
			observation: [
				this.classificationVersion
					? this.classificationVersion.observation || '' : '',
				[]
			],
			isIndication: [
				{
					value: this.classificationVersion && this.classificationVersion.sample
						? this.classificationVersion.sample.indicationSpecialCoffee || false : false,
					disabled: this.specialCoffee
				},
				[]
			],
			showItemOwner: [this.isShowItemOwner,[]],
		});
	}

  loadParameter(){
    this.parameterService.findByKey("BLIND_CLASSIFICATION").then(parameter => {
      if (!parameter.value){
        this.blindClassification =  false;
        return;
      }
      this.blindClassification = parameter.value === "S";
    });
  }


  itensIsEmpty(): boolean {
		return !this.classificationVersion
			|| !this.classificationVersion.items
			|| !this.classificationVersion.items.length;
	}

	save() {
		this.submitted = true;

		Object.keys(this.form.controls).forEach(key => {
			this.form.controls[key].markAsDirty();
		});
		if (!this.form.valid) {
			return;
		}

		Object.keys(this.classificationItemFormComponent.form.controls).forEach(key => {
			this.classificationItemFormComponent.form.controls[key].markAsDirty();
		});
		if(!this.classificationItemFormComponent.form.valid) {
			return;
		}

		if (this.itensIsEmpty()) {
			Notification.error('É necessário inserir pelo menos um item antes de salvar!');
			return;
		}

		/**
		 * Validação para campos obrigatórios.
		 * Percorre todos os obrigatórios e verifica se foram incluídos.
		 */
		let typesRequiredNotInformed = [];
		if (this.classificationVersion.allTypes != null && this.classificationVersion.allTypes.length > 0) {

			for (const type of this.classificationVersion.allTypes) {

				if ((type.requiredNormal != null && type.requiredNormal === true)
					|| ((this.specialCoffee && type.requiredSpecialCoffee != null && type.requiredSpecialCoffee === true))) {

					let exist = false;
					for (const item of this.classificationVersion.items) {
						if (item.classificationType.id == type.id && item.validate()) {
							exist = true;
							break;
						}
					}

					if (!exist) {
						typesRequiredNotInformed.push(type.name);
					}
				}
			}

      // tratar campos obrigatorios

			if (typesRequiredNotInformed.length > 0) {

				let msg = '';
				let listItens = typesRequiredNotInformed.join(', ');

				if (typesRequiredNotInformed.length == 1) {
					msg = 'O item ' + listItens + ' é obrigatório.';
				}
				else {
					msg = 'Os itens ' + listItens + ' são obrigatórios.';
				}

				Notification.error(msg);
				return;
			}
		}

    this.classificationVersion.items = this.classificationVersion.items.filter(item => {
			return item.validate();
		});

		this.loading = true;

		if (!this.classificationVersion.sample || !this.classificationVersion.sample.id) {
			this.classificationVersion.sample = new Sample();
			this.classificationVersion.sample.barcode = this.form.value.barcode;
		}

		this.classificationVersion.version = this.form.value.version;
		this.classificationVersion.classificationDateString = this.form.value.classificationDate;

		this.classificationVersion.classifiedBy = new User(
			this.form.value.classifiedBy
		);

		this.classificationVersion.tastedBy = new User(
			this.form.value.tastedBy
		);
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
		this.classificationVersion.sample.indicationSpecialCoffee = this.form.value.isIndication;

		// classificação de café especial
		this.classificationVersion.specialCoffee = this.specialCoffee;
		if (this.specialCoffee) {
			this.classificationVersion.sample.indicationSpecialCoffee = this.specialCoffee;
		}

		// sempre é uma nova versão
		this.classificationVersion.id = null;

		return this.classificationService
			.save(this.classificationVersion)
			.then(() => {
				Notification.success('Classificação salva com sucesso!');
				this.loading = false;
				this.reset();
			})
			.catch(error => this.handleError(error));
	}

	reset() {
		this.submitted = false;
		this.classificationVersion = ClassificationVersion.fromData();
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

	private buildCustomValidation(customValidation: string): boolean {
    let operations = customValidation.split('AND');

    let areValid: boolean[] = [];

    for (let operation of operations) {
      let operator = operation.split(/\.(.+)/); // split on first .
      let fieldName = operator[0];
      let operatorAndValue = operator[1];

      let fields = this.classificationVersion.items.filter(i => {
        return i.classificationType.name === fieldName;
      });

      let field: ClassificationItem;
      if (fields && fields.length) {
        field = fields[0];
      }

      if (field) {
        let val;
        try {
          val = Number(field.value);
        } catch (e) {
          val = 0.0;
        }
        if (operatorAndValue.indexOf('gt') >= 0) {
          let value;
          try {
            value = Number(operatorAndValue.replace(/[^\d.-]/g, ''));
          } catch (e) {
            value = 0.0;
          }
          if (val > value) {
            areValid.push(false);
          } else {
            areValid.push(true);
          }
        }
        if (operatorAndValue.indexOf('contains') >= 0) {
          if (operatorAndValue.indexOf(field.value) >= 0 && field.value.length) {
            areValid.push(false);
          } else {
            areValid.push(true);
          }
        }
      }
    }
    let invalidCount = 0;
    for (let r of areValid) {
      if (!r) {
        invalidCount++;
      }
    }
    return invalidCount != areValid.length || operations.length != areValid.length || invalidCount == 0;

  }

	private setDefaultClassifier() {
		this.classificationVersion.classifiedBy = this.authService.accessToken.user;
		this.classificationVersion.tastedBy = this.authService.accessToken.user;
	}

}
