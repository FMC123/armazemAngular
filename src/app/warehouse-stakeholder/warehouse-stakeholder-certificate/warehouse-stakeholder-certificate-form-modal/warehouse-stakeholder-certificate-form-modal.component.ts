import {Component, EventEmitter, Input, OnInit, Output, ViewChildren} from '@angular/core';
import {BatchOperationCertificate} from "../../../batch-operation/batch-operation-certificate/batch-operation-certificate";
import {WarehouseStakeholderCertificate} from "../warehouse-stakeholder-certificate";
import {Focusable} from "../../../shared/forms/focusable/focusable.directive";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Certificate} from "../../../certificate/certificate";
import {CertificateService} from "../../../certificate/certificate.service";
import {ErrorHandler} from "../../../shared/errors/error-handler";
import {Masks} from "../../../shared/forms/masks/masks";
import {WarehouseStakeholderCertificateService} from "../warehouse-stakeholder-certificate.service";
import {DateTimeHelper} from "../../../shared/globalization";
import {WarehouseStakeholder} from "../../warehouse-stakeholder";
import {Notification} from "../../../shared/notification";

@Component({
  selector: 'app-warehouse-stakeholder-certificate-form-modal',
  templateUrl: './warehouse-stakeholder-certificate-form-modal.component.html',
  styleUrls: ['./warehouse-stakeholder-certificate-form-modal.component.css']
})
export class WarehouseStakeholderCertificateFormModalComponent implements OnInit {
  @Output() close: EventEmitter<any> = new EventEmitter<any>(true);
  @ViewChildren(Focusable) focusables;
  @Input() owner : WarehouseStakeholder;
  @Input() editingCertificate: WarehouseStakeholderCertificate = new WarehouseStakeholderCertificate();
  @Input() listedCertificates: Array<Certificate> = [];


  form: FormGroup
  loading = false;

  wsCertificate: WarehouseStakeholderCertificate;
  certificates: Array<Certificate>;

  decimalMask = Masks.decimalMask;
  dateMask = Masks.dateMask;

  constructor(private formBuilder: FormBuilder,
              private wsCertificateService: WarehouseStakeholderCertificateService,
              private certificateService: CertificateService,
              private errorHandler: ErrorHandler) {
  }

  ngOnInit() {
    this.wsCertificate = this.editingCertificate && this.editingCertificate.id  ? this.editingCertificate : new WarehouseStakeholderCertificate();
    this.certificateService.list().then(certificates => {
      this.certificates = certificates;
      this.buildForm();
    }).catch((error) => this.errorHandler.fromServer(error));
  }

  buildForm() {
    this.form = this.formBuilder.group({
      certificateId: [this.wsCertificate.certificate ? this.wsCertificate.certificate.id || '' : '', Validators.required],
      certifiedCustodyCode: [this.wsCertificate.certifiedCustodyCode || '', Validators.required],
      certifiedCustodyExpirationDate: [this.wsCertificate.certifiedOriginExpirationDateString || '', Validators.required],
      certifiedOriginCode: [this.wsCertificate.certifiedOriginCode || '', Validators.required],
      certifiedOriginExpirationDate: [this.wsCertificate.certifiedCustodyExpirationDateString || '', Validators.required],
    });
  }

  save() {
    Object.keys(this.form.controls).forEach((key) => {
      this.form.controls[key].markAsDirty();
    });
    if (!this.form.valid) {
      return;
    }
    this.loading = true;

    this.wsCertificate.certificate = this.certificates.find((c) => c.id === this.form.get('certificateId').value);
    this.wsCertificate.certifiedCustodyCode = this.form.get('certifiedCustodyCode').value;
    this.wsCertificate.certifiedOriginCode = this.form.get('certifiedOriginCode').value;
    this.wsCertificate.certifiedCustodyExpirationDate =  DateTimeHelper.fromDDMMYYYY(this.form.get('certifiedCustodyExpirationDate').value);
    this.wsCertificate.certifiedOriginExpirationDate =  DateTimeHelper.fromDDMMYYYY(this.form.get('certifiedOriginExpirationDate').value);
    if(this.owner && this.owner.id){
      this.wsCertificate.owner = this.owner;
    }

    this.wsCertificateService.save(this.wsCertificate).then(() => {
      Notification.success('Certificado salvo com sucesso!');
      this.loading = false;
      this.close.emit();
    }).catch((error) => {
      this.errorHandler.fromServer(error);
      this.loading = false;
    });
  }

  focusOnInput() {
    return () => {
      if (this.focusables && this.focusables.length > 0) {
        this.focusables.first.focus();
      }
    };
  }

}
