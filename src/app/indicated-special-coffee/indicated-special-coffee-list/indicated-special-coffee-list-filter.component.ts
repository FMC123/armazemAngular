import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Department } from "../../department/department";
import { DepartmentService } from "../../department/department.service";
import { ErrorHandler } from '../../shared/errors/error-handler';
import { Warehouse } from '../../warehouse/warehouse';
import { WarehouseService } from '../../warehouse/warehouse.service';
import {ClassificationVersionFilter} from "./classification-version-filter";
import {ServiceInstructionStatus} from "../../service-instruction/service-instruction-status";
import {ClassificationProcessStatus} from "../../classification/classification-process-status";
import {Logger} from "../../shared/logger/logger";
import {UserService} from "../../user/user.service";
import {User} from "../../user/user";
import {SpecialCoffeeSituation} from "../../classification/special-coffee-situation";


@Component({
	selector: 'app-indicated-special-coffee-list-filter',
	templateUrl: 'indicated-special-coffee-list-filter.component.html'
})
export class IndicatedSpecialCoffeeListFilterComponent implements OnInit {
	@Input() loading: boolean;
	@Output() filterChange: EventEmitter<ClassificationVersionFilter> = new EventEmitter<ClassificationVersionFilter>();

	form: FormGroup;
	filter: ClassificationVersionFilter = new ClassificationVersionFilter();
  users: Array<User> = [];
  classificationsProcessStatus : Array<ClassificationProcessStatus> = ClassificationProcessStatus.list();

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

	buildForm() {
		this.form = this.formBuilder.group({
      classifiedById: [''],
      classificationProcessStatus: [ClassificationProcessStatus.PENDING_REQUEST.code],
      batchCode: ['']
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
