import { CustomValidators } from './../../shared/forms/validators/custom-validators';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';

import { ErrorHandler } from '../../shared/shared.module';
import { AuthService } from '../auth.service';
import { Notification } from './../../shared/notification/notification';

@Component({
  selector: 'app-password-change',
  templateUrl: './password-change.component.html'
})
export class PasswordChangeComponent implements OnInit {
  form: FormGroup;
  loading: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private auth: AuthService,
    private errorHandler: ErrorHandler
  ) { }

  ngOnInit() {
    Notification.clearErrors();
    this.buildForm();
  }

  buildForm() {
    this.form = this.formBuilder.group({
      'oldPassword': ['', Validators.required],
      'passwordConfirmation': ['',
        [Validators.required, CustomValidators.equalValidator('password')]
      ],
      'password': ['', Validators.required]
    });
  }

  submit() {
    Object.keys(this.form.controls).forEach((key) => {
      this.form.controls[key].markAsDirty();
    });
    if (!this.form.valid) {
      return;
    }
    this.loading = true;
    this.auth.changePassword(this.form.value.oldPassword, this.form.value.password).then(() => {
      Notification.success('Senha alterada com sucesso!');
      this.router.navigate(['']);
    }).catch((error) => this.handleError(error));
  }

  handleError(error){
    this.loading = false;
    return this.errorHandler.fromServer(error);
  }
}
