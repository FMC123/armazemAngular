import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ErrorHandler } from '../../shared/errors/error-handler';
import {ClassificationVersionFilter} from "./classification-version-filter";
import {UserService} from "../../user/user.service";
import {User} from "../../user/user";
import {SpecialCoffeeSituation} from "../../classification/special-coffee-situation";
import {Subscription} from "rxjs";
import {Position} from "../../position/position";


@Component({
	selector: 'app-indicated-special-coffee-list-filter',
	templateUrl: 'analyze-special-coffee-list-filter.component.html'
})
export class AnalyzeSpecialCoffeeListFilterComponent implements OnInit, OnDestroy {
	@Input() loading: boolean;
	@Output() filterChange: EventEmitter<ClassificationVersionFilter> = new EventEmitter<ClassificationVersionFilter>();

	form: FormGroup;
	filter: ClassificationVersionFilter = new ClassificationVersionFilter();
  users: Array<User> = [];
  specialCoffeesSituation : Array<SpecialCoffeeSituation> = SpecialCoffeeSituation.listByFilter();
  specialCoffeeSituationSubscription: Subscription;

	constructor(
		private formBuilder: FormBuilder,
		private route: ActivatedRoute,
    private userService: UserService,
		private errorHandler: ErrorHandler
	) {}

	ngOnInit() {
    this.userService
      .listClassifiers()
      .then(users => {
        this.users = users;
      })
      .catch(error => this.errorHandler.fromServer(error));

		this.buildForm();
	}

  ngOnDestroy() {

    let subscriptions = [
      this.specialCoffeeSituationSubscription
    ];

    subscriptions.forEach((subscription: Subscription) => {
      if (subscription && !subscription.closed) {
        subscription.unsubscribe();
      }
    });
  }

	buildForm() {
		this.form = this.formBuilder.group({
      barcode: [''],
      batchCode: [''],
      specialCoffeeSituation: [SpecialCoffeeSituation.NOT_ANALYZED.name]
		});

    this.specialCoffeeSituationSubscription = this.form.get('specialCoffeeSituation').valueChanges.subscribe((specialCoffeeSituation) => {
      if (specialCoffeeSituation ==  'Não Indicados') {
        this.form.controls["batchCode"].setValidators(Validators.required);
        this.form.controls["batchCode"].updateValueAndValidity();
      } else {
        this.form.controls["batchCode"].setValidators(null);
        this.form.controls["batchCode"].updateValueAndValidity();
      }
    });
	}

	submit() {
		Object.keys(this.form.controls).forEach(key => {
			this.form.controls[key].markAsDirty();
		});

		if (!this.form.valid) {
			return;
		}

		this.filter = ClassificationVersionFilter.fromData(this.form.value);
		this.filterChange.emit(this.filter);
	}
}
