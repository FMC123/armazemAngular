import { CompanyService } from '../../company/company.service';
import { Company } from '../../company/company';
import { ErrorHandler } from './../../shared/errors/error-handler';
import { Masks } from './../../shared/forms/masks/masks';
import { Notification } from './../../shared/notification/notification';
import { User } from './../../user/user';
import { UserAdministratorService } from './../user-administrator.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-administrator-form.component.html'
})
export class UserAdministratorFormComponent implements OnInit {
  user: User;
  form: FormGroup;
  loading: boolean = false;
  passwordShown: boolean = false;
  passwordControl: FormControl;
  companies: Array<Company>;

  submitted: boolean = false;
  dateTimeMask: any = Masks.dateTimeMask;
  decimalMask: any = Masks.decimalMask;

  get editing(){
    return !!this.user && !!this.user.id;
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private userService: UserAdministratorService,
    private errorHandler: ErrorHandler,
    private companyService: CompanyService,
  ) { }

  ngOnInit() {
    Notification.clearErrors();

    this.companyService.list().then((companies) => {
      this.companies = companies;
    });

    this.route.data.forEach((data: {user: User}) => {
      this.user = data.user;
      this.buildForm();
    });
  }

  buildForm() {
    this.form = this.formBuilder.group({
      'name': [this.user.name || '', Validators.required],
      'login': [this.user.login || '',
        [Validators.required, Validators.pattern('^[a-zA-Z][a-zA-Z0-9-_\.]+')]
      ],
      'password': ['', Validators.required],
      'companyId': [this.user.company ? this.user.company.id || null : null, Validators.required ],
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
    Object.keys(this.form.controls).forEach((key) => {
      this.form.controls[key].markAsDirty();
    });
    if (!this.valid) {
      return;
    }
    this.loading = true;
    this.userService.loginExists(this.user.id, this.form.value.login).then((exists) => {
      if (exists) {
        this.form.get('login').setErrors({
          'alreadyInUse': true
        });
        this.loading = false;
        return;
      }
      this.user.name = this.form.value.name;
      this.user.password = this.form.value.password;
      this.user.login = this.form.value.login;
      this.user.company = this.companies.find(c => c.id === this.form.value.companyId);

      return this.userService.save(this.user).then(() => {
        Notification.success('Administrador salvo com sucesso!');
        this.router.navigate(['/user-administrator']);
      });
    }).catch((error) => this.handleError(error));
  }

  handleError(error) {
    this.loading = false;
    return this.errorHandler.fromServer(error);
  }

}
