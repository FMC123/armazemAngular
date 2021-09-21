import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import {
	AbstractControl,
	FormBuilder,
	FormGroup,
	Validators,
	ValidatorFn
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Masks } from '../../shared/forms/masks/masks';
import { ErrorHandler } from '../../shared/errors/error-handler';
import { Notification } from '../../shared/notification';
import { User } from '../../user/user';
import { UserService } from '../../user/user.service';
import { DateTimeHelper } from '../../shared/globalization';
import { Observable } from 'rxjs/Observable';
import { SampleService } from '../../sample/sample.service';
import { Sample } from '../../sample/sample';
import {ClassificationVersion} from "../../classification/classification-version";
import {ClassificationService} from "../../classification/classification.service";
import {DrinkService} from "../../drink/drink.service";
import {AnalyzeSpecialCoffeeService} from "../analyze-special-coffee.service";


@Component({
	selector: 'app-analyze-special-coffee-form',
	templateUrl: './analyze-special-coffee-form.component.html'
})
export class AnalyzeSpecialCoffeeFormComponent implements OnInit, OnDestroy {
	users: Array<User> = [];
	classificationVersion: ClassificationVersion;
	barcodeDatasource: Observable<Array<String>>;

	submitted = false;
	integerMask = Masks.integerMask;
	decimalMask = Masks.decimalMask;
	dateMask: any = Masks.dateMask;
	form: FormGroup;
	loading = false;
	isIndication = false;
	invalidBarcode = false;
	/**
	 * Indicativo para classificação de café especial
	 */
	specialCoffee: boolean = true;
	/**
	 * Código de barras vinda da URL, para novo café especial
	 */
	barcode: string = '';

	constructor(
		private route: ActivatedRoute,
		private router: Router,
		private formBuilder: FormBuilder,
		private analyzeSpecialCoffeeService: AnalyzeSpecialCoffeeService,
    private classificationService: ClassificationService,
		private userService: UserService,
		private sampleService: SampleService,
    private drinkService: DrinkService,
		private errorHandler: ErrorHandler
	) { }

	ngOnInit() {
		Notification.clearErrors();

		this.userService
			.listClassifiers()
			.then(users => {
				this.users = users;
			})
			.catch(error => this.errorHandler.fromServer(error));

    this.route.data.forEach((data: { classification: ClassificationVersion }) => {

			this.classificationVersion = data.classification;

			if (this.classificationVersion
        && this.classificationVersion.id
        && this.classificationVersion.version) {
				this.classificationVersion.version++;
			}

			this.buildForm();

			this.barcodeDatasource = Observable.create((observer: any) => {
				observer.next(this.form.get('barcode').value);

			}).mergeMap(value => {
				return Observable.fromPromise(this.sampleService.search(value, true))
			});
		});

    this.onBlurMethod(this.form.get('barcode').value);

		// parâmetros
		this.route.queryParams.subscribe(params => {
			if (params['barcode'] != null && params['barcode'] != '') {
				this.barcode = params['barcode'];
			}

			this.buildForm();
		});
	}

  onBlurMethod(value: string) {
    if (!value || value.length < 30) {

      if (value.length > 0) {
        this.invalidBarcode = true;
      }

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
        {
          value: this.classificationVersion
            ? this.classificationVersion.classificationDateString || '' : '',
          disabled: true
        },
				[Validators.required, this.dateValidator()]
			],
			classifiedBy: [
        {
          value: this.classificationVersion && this.classificationVersion.classifiedBy
            ? this.classificationVersion.classifiedBy.id || '' : '',
          disabled: true
        },
				[Validators.required]
			],
      analyzedSpecialDate: [
        {
          value:  this.classificationVersion
            ? this.classificationVersion.analyzedSpecialDateString || '' : '',
          disabled: false
        },
        [Validators.required, this.dateValidator()]
      ],
      analyzedSpecialBy: [
        {
          value: this.classificationVersion && this.classificationVersion.analyzedSpecialBy
            ? this.classificationVersion.analyzedSpecialBy.id || '' : '',
          disabled: false
        },
        [Validators.required]
      ]
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
						if (item.classificationType.id == type.id) {
							exist = true;
							break;
						}
					}

					if (!exist) {
						typesRequiredNotInformed.push(type.name);
					}
				}
			}

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

    this.classificationVersion.analyzedSpecialBy = new User(
      this.form.value.analyzedSpecialBy
    );

    this.classificationVersion.analyzedSpecialDateString = this.form.value.analyzedSpecialDate;

		this.classificationVersion.items.forEach(item =>{
		  if(item.classificationType.specialCoffeeItem == true){
        item.classifiedBy = this.classificationVersion.analyzedSpecialBy;
        item.classificationDateString = this.form.value.analyzedSpecialDate;
      }
    });

		this.classificationVersion.items = this.classificationVersion.items.filter(item => {
			return item.validate();
		})

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

		return this.analyzeSpecialCoffeeService
			.updateAnalyzeSpecialCoffee(this.classificationVersion)
			.then(() => {
				Notification.success('Análise Café Especial realizada com sucesso!');
				this.loading = false;
        this.router.navigate(['/analyze-special-coffee']);
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
}
