import { Component, OnInit, ViewChildren, AfterViewInit, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { Focusable } from './../../shared/forms/focusable/focusable.directive';

import { Notification } from './../../shared/notification/notification';
import { ErrorHandler } from '../../shared/shared.module';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
})
export class LoginFormComponent implements OnInit, AfterViewInit {
  @ViewChildren(Focusable) focusables;
  form: FormGroup;

  loading: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private auth: AuthService,
    private errorHandler: ErrorHandler,
    private elementRef: ElementRef,
  ) { }

  ngOnInit() {
    Notification.clearErrors();
    $('body').css('background', '#FFFFFF');
    this.buildForm();
  }

  ngAfterViewInit() {
    this.focusOnInput();
  }

  focusOnInput() {
    if (this.focusables && this.focusables.length > 0) {
      this.focusables.first.focus();
    }
  }

  get rememberedCredentials() {
    return this.auth.rememberedCredentials;
  }

  forgetRememberedCredentials(){
    this.auth.forgetRememberedCredentials();
  }

  buildForm() {
    this.form = this.formBuilder.group({
      'login': ['', Validators.required]
    });
  }

  submit() {
    Object.keys(this.form.controls).forEach((key) => {
      this.form.controls[key].markAsDirty();
    });
    if (!this.form.valid) {
      this.focusOnInput();
      return;
    }
    this.loading = true;
    this.auth.findAndSetRememberedLogin(this.form.value.login)
                    .then(() => {
                      this.loading = false;
                      $('body').css('background', '#ecf0f5');
                    })
                    .catch((error) => this.handleError(error));
  }

  handleError(error) {
    this.loading = false;
    this.form.get('login').setValue(null);
    this.form.get('login').markAsPristine();
    this.focusOnInput();
    return this.errorHandler.fromServer(error);
  }
}
