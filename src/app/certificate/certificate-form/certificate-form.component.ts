import { environment } from '../../../environments/environment';
import { Notification } from './../../shared/notification/notification';
import { Certificate } from './../certificate';
import { CertificateService } from './../certificate.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {ErrorHandler} from "../../shared/errors/error-handler";
const filesize = require('filesize');

const VALID_IMAGE_TYPES = ['image/jpeg',
                  'image/pjpeg',
                  'image/jpeg',
                  'image/pjpeg',
                  'image/jpeg',
                  'image/pjpeg',
                  'image/png',
                  'image/x-png'];

@Component({
  selector: 'app-certificate-form',
  templateUrl: './certificate-form.component.html'
})
export class CertificateFormComponent implements OnInit {
  certificate: Certificate;
  form: FormGroup;
  loading: boolean = false;
  file: any = null;

  fileErrors: any = null;
  maxFileSizeHuman: string = filesize(environment.MAX_CERTIFICATE_FILE_SIZE);

  get editing(){
    return !!this.certificate && !!this.certificate.id;
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private errorHandler: ErrorHandler,
    private certificateService: CertificateService
  ) { }

  ngOnInit() {
    Notification.clearErrors();
    this.route.data.forEach((data: {certificate: Certificate}) => {
      this.certificate = data.certificate;
      this.buildForm();
    });
  }

  buildForm() {
    this.form = this.formBuilder.group({
      'code': [this.certificate.code || '', Validators.required],
      'name': [this.certificate.name || '', Validators.required],
      'procafeCode': [this.certificate.procafeCode || ''],
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
    this.certificate.code = this.form.value.code;
    this.certificate.name = this.form.value.name;
    this.certificate.procafeCode = this.form.value.procafeCode;
    this.loading = true;
    this.certificateService.saveWithFile(this.certificate, this.file).then(() => {
      Notification.success('Salvo com sucesso!');
      this.router.navigate(['/certificate']);
    }).catch(error => {
      this.handleError(error)
      this.loading = false
    });
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
        if (!this.fileErrors) this.fileErrors = {};
        this.fileErrors['required'] = true;
      }
      return;
    }

    let validType = VALID_IMAGE_TYPES.some((it) => it === file.type);
    if (!validType) {
      if (!this.fileErrors) this.fileErrors = {};
      this.fileErrors['invalidType'] = true;
    }
    let maxFileSize = environment.MAX_CERTIFICATE_FILE_SIZE;
    if (file.size > maxFileSize) {
      if (!this.fileErrors) this.fileErrors = {};
      this.fileErrors['invalidSize'] = true;
    }
  }

  handleError(error) {
    this.loading = false;
    return this.errorHandler.fromServer(error);
  }
}
