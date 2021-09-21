import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MobileApp } from 'app/mobile-apps/mobile-app';
import { MobileAppService } from 'app/mobile-apps/mobile-app.service';

import { environment } from '../../../environments/environment';
import { Notification } from './../../shared/notification/notification';

const filesize = require('filesize');

const VALID_APK_TYPES = ['application/vnd.android.package-archive'];

@Component({
  selector: 'app-mobile-app-form',
  templateUrl: './mobile-app-form.component.html'
})
export class MobileAppFormComponent implements OnInit {
  mobileApp: MobileApp;
  form: FormGroup;
  loading: boolean = false;
  file: any = null;

  fileErrors: any = null;
  maxFileSizeHuman: string = filesize(environment.MAX_APK_FILE_SIZE);

  get editing() {
    return !!this.mobileApp && !!this.mobileApp.id;
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private mobileAppService: MobileAppService
  ) { }

  ngOnInit() {
    Notification.clearErrors();
    this.route.data.forEach((data: { mobileApp: MobileApp }) => {
      this.mobileApp = data.mobileApp;
      this.buildForm();
    });
  }

  buildForm() {
    this.form = this.formBuilder.group({
      'minWmsVersion': [this.mobileApp.minWmsVersion || '', Validators.required],
      'mobileAppVersion': [this.mobileApp.mobileAppVersion || '', Validators.required],
    });
  }

  save() {
    Object.keys(this.form.controls).forEach((key) => {
      this.form.controls[key].markAsDirty();
    });
    this.validateFile();
    if (!this.form.valid || this.fileErrors) {
      return;
    }
    this.mobileApp.minWmsVersion = this.form.value.minWmsVersion;
    this.mobileApp.mobileAppVersion = this.form.value.mobileAppVersion;
    this.loading = true;
    this.mobileAppService.saveWithFile(this.mobileApp, this.file).then(() => {
      Notification.success('Salvo com sucesso!');
      this.router.navigate(['/mobile-app']);
    }).catch(() => this.loading = false);
  }

  fileChange(event) {
    this.fileErrors = null;
    let files = event.srcElement.files;
    if (!files || !files.length) {
      this.file = null;
      this.validateFile();
      return;
    }
    this.file = files[0];
    this.validateFile();
  }

  validateFile() {
    let file = this.file;
    if (!file) {
      if (!this.editing) {
        if (!this.fileErrors) {
          this.fileErrors = {};
        }
        this.fileErrors['required'] = true;
      }
      return;
    }

    let validType = VALID_APK_TYPES.some((it) => it === file.type);
    if (!validType) {
      if (!this.fileErrors) {
        this.fileErrors = {};
      }
      this.fileErrors['invalidType'] = true;
    }
    let maxFileSize = environment.MAX_APK_FILE_SIZE;
    if (file.size > maxFileSize) {
      if (!this.fileErrors) {
        this.fileErrors = {};
      }
      this.fileErrors['invalidSize'] = true;
    }
  }
}
