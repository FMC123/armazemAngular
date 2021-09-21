import { ErrorHandler } from './../../shared/errors/error-handler';
import { Masks } from './../../shared/forms/masks/masks';
import { Notification } from './../../shared/notification/notification';
import { User } from './../user';
import { UserService } from './../user.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import {
	FormBuilder,
	FormControl,
	FormGroup,
	Validators
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Department } from '../../department/department';
import { DepartmentService } from '../../department/department.service';

@Component({
	selector: 'app-user-form',
	templateUrl: './user-form.component.html'
})
export class UserFormComponent implements OnInit {
	user: User;
	form: FormGroup;
	loading: boolean = false;
	passwordShown: boolean = false;
	passwordControl: FormControl;
	departments: Array<Department>;

	submitted: boolean = false;
	dateTimeMask: any = Masks.dateTimeMask;
	decimalMask: any = Masks.decimalMask;

	get editing() {
		return !!this.user && !!this.user.id;
	}

	constructor(
		private route: ActivatedRoute,
		private router: Router,
		private formBuilder: FormBuilder,
		private userService: UserService,
		private departmentService: DepartmentService,
		private errorHandler: ErrorHandler
	) {}

	ngOnInit() {
		Notification.clearErrors();

		this.departmentService.list().then(departaments => {
			this.departments = departaments;
		});

		this.route.data.forEach((data: { user: User }) => {
			this.user = data.user;
			this.buildForm();
		});
	}

	buildForm() {
		this.form = this.formBuilder.group({
			name: [this.user.name || '', Validators.required],
			login: [
				this.user.login || '',
				[Validators.required, Validators.pattern('^[a-zA-Z][a-zA-Z0-9-_.]+')]
			],
			password: ['', Validators.required],
			departmentId: [this.user.department ? this.user.department.id : ''],
			isClassifier: [this.user.isClassifier != null ? this.user.isClassifier : false],
			internalCode: [this.user.internalCode ? this.user.internalCode : '']
		});

		if (this.editing) {
			this.passwordControl = <FormControl>this.form.get('password');
			this.disablePassword();
		}
	}

	enablePassword() {
		this.passwordShown = true;
		this.form.addControl('password', this.passwordControl);
	}

	disablePassword() {
		this.passwordShown = false;
		this.form.removeControl('password');
	}

	get valid() {
		return this.form.valid;
	}

	save() {
		this.submitted = true;
		Object.keys(this.form.controls).forEach(key => {
			this.form.controls[key].markAsDirty();
		});
		if (!this.valid) {
			return;
		}
		this.loading = true;
		this.userService
			.loginExists(this.user.id, this.form.value.login)
			.then(exists => {
				if (exists) {
					this.form.get('login').setErrors({
						alreadyInUse: true
					});
					this.loading = false;
					return;
				}
				this.user.name = this.form.value.name;
				this.user.password = this.form.value.password;
				this.user.login = this.form.value.login;
				this.user.department = this.departments.find(
					d => d.id === this.form.value.departmentId
				);

				this.user.isClassifier = this.form.value.isClassifier;
				this.user.internalCode = this.form.value.internalCode;

				return this.userService.save(this.user).then(() => {
					Notification.success('Usuário salvo com sucesso!');
					this.router.navigate(['/user']);
				});
			})
			.catch(error => this.handleError(error));
	}

	handleError(error) {
		this.loading = false;
		return this.errorHandler.fromServer(error);
	}
}