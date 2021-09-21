import { CertificateService } from '../../certificate/certificate.service';
import { Certificate } from '../../certificate/certificate';
import { Masks } from '../../shared/forms/masks/masks';
import { Focusable } from '../../shared/forms/focusable/focusable.directive';
import { Component, EventEmitter, Input, OnInit, Output, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { BatchOperationCertificate } from './batch-operation-certificate';
import { BatchOperationCertificateService } from 'app/batch-operation/batch-operation-certificate/batch-operation-certificate.service';
import { BatchOperation } from 'app/batch-operation/batch-operation';
import { ErrorHandler } from 'app/shared/errors/error-handler';

@Component({
  selector: 'app-batch-operation-certificate-form-modal',
  templateUrl: './batch-operation-certificate-form-modal.component.html'
})
export class BatchOperationCertificateFormModalComponent implements OnInit {
  @Output() close: EventEmitter<BatchOperationCertificate> = new EventEmitter<BatchOperationCertificate>(false);
  @ViewChildren(Focusable) focusables;
  @Input() batchOperation: BatchOperation;

  certificate: BatchOperationCertificate;
  certificates: Array<Certificate>;
  form: FormGroup;
  loading = false;

  constructor(
    private formBuilder: FormBuilder,
    private certificateService: CertificateService,
    private batchOperationCertificateService: BatchOperationCertificateService,
    private errorHandler: ErrorHandler,
  ) {}

  ngOnInit() {
    this.certificate = new BatchOperationCertificate();
    this.certificateService.list().then(certificates => {
      this.certificates = certificates;
    }).catch((error) => this.errorHandler.fromServer(error));

    this.buildForm();
  }

  focusOnInput() {
    return () => {
      if (this.focusables && this.focusables.length > 0) {
        this.focusables.first.focus();
      }
    };
  }

  buildForm() {
    this.form = this.formBuilder.group({
      certificateId: [ this.certificate.certificate ? this.certificate.certificate.id || '' : '' , Validators.required],
    });
  }

  submit() {
    Object.keys(this.form.controls).forEach((key) => {
      this.form.controls[key].markAsDirty();
    });

    if (!this.form.valid) {
      return;
    }

    this.certificate.batchOperation = this.batchOperation;
    this.certificate.certificate = this.certificates.find(c => c.id === this.form.value.certificateId);

    this.loading = true;
    this.batchOperationCertificateService.create(this.certificate)
      .then(() => {
        this.loading = false;
        this.close.emit(this.certificate);
        (<any>jQuery)('.modal').modal('hide');
      })
      .catch((error) => {
        this.loading = false;
        this.errorHandler.fromServer(error);
      });
  }

}
