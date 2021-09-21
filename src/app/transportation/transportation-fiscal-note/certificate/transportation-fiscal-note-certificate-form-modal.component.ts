import { Component, EventEmitter, Input, OnInit, Output, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Certificate } from '../../../certificate/certificate';
import { CertificateService } from '../../../certificate/certificate.service';
import { Focusable } from '../../../shared/forms/focusable/focusable.directive';
import { Masks } from '../../../shared/forms/masks/masks';
import { CustomValidators } from '../../../shared/forms/validators/custom-validators';
import { TransportationFiscalNoteCertificate } from './transportation-fiscal-note-certificate';
import {WarehouseStakeholderCertificateService} from "../../../warehouse-stakeholder/warehouse-stakeholder-certificate/warehouse-stakeholder-certificate.service";
import {WarehouseStakeholderCertificate} from "../../../warehouse-stakeholder/warehouse-stakeholder-certificate/warehouse-stakeholder-certificate";
import {FiscalNote} from "../../../fiscal-note/fiscal-note";
import {Notification} from "../../../shared/notification";
import {ModalManager} from "../../../shared/modals/modal-manager";
import {DateTimeHelper} from "../../../shared/globalization";

@Component({
  selector: 'app-transportation-fiscal-note-certificate-form-modal',
  templateUrl: './transportation-fiscal-note-certificate-form-modal.component.html'
})
export class TransportationFiscalNoteCertificateFormModalComponent implements OnInit {
  @Output() close: EventEmitter<void> = new EventEmitter<void>(false);
  @Input() certificate: TransportationFiscalNoteCertificate;
  @Input() fiscalNote: FiscalNote;
  @Output() save: EventEmitter<TransportationFiscalNoteCertificate> = new EventEmitter<TransportationFiscalNoteCertificate>(false);

  @ViewChildren(Focusable) focusables;
  integerMask = Masks.integerMask;
  certificates: Array<Certificate>;
  certificateInfo: Array<WarehouseStakeholderCertificate>;
  invoiceFieldBlock = false;
  balanceFieldBlock = false;
  form: FormGroup;

  alertCertificateExpired: ModalManager = new ModalManager();
  certificateAlertMessage: string;

  constructor(
    private formBuilder: FormBuilder,
    private certificateService: CertificateService,
    private ownerCertificateService: WarehouseStakeholderCertificateService,
  ) {}

  ngOnInit() {
    this.certificateService.list().then(certificates => {
      this.certificates = certificates;
    });
    this.certificateService.loadCerticadefield().then((invoiceFieldBlock) => {
      this.invoiceFieldBlock = invoiceFieldBlock;
      this.buildForm();
    });

    this.certificateService.loadBalanceFieldBlock().then((balanceFieldBlock) => {
      this.balanceFieldBlock = balanceFieldBlock;
      this.buildForm();
    });

    if(this.fiscalNote && this.fiscalNote.senderStakeholder) {
      this.ownerCertificateService.listAllByStakeholder(this.fiscalNote.senderStakeholder.id).then(res => {
        this.certificateInfo = res;
      });
    }

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
    let certificateId = this.certificate.certificate ? this.certificate.certificate.id : null;
    this.form = this.formBuilder.group({
      certificateId: [ this.certificate.certificate ? this.certificate.certificate.id || '' : '' , Validators.required],
      certifiedCustodyCode: [ this.certificate.certifiedCustodyCode || this.findCertifiedCustodyCode(certificateId)],
      certifiedOriginCode: [ this.certificate.certifiedOriginCode || this.findCertifiedOriginCode(certificateId)],
    });
  }

  findCertifiedCustodyCode(id){
    if(this.certificateInfo && id){
      let cert = this.certificateInfo.find( c => c.certificate.id === id);
      if(cert) {
        if (cert.certifiedCustodyExpirationDate > Date.now()) {
          return cert ? cert.certifiedCustodyCode : '';
        } else {
          (<any>jQuery)('.modal').modal({backdrop: 'static', keyboard: false});
          this.certificateAlertMessage = `O certificado expirou em ${DateTimeHelper.toDDMMYYYY(cert.certifiedCustodyExpirationDate)}!“`;
          this.alertCertificateExpired.open(null);
        }
      }
    }
    return '';
  }

  findCertifiedOriginCode(id){
    if(this.certificateInfo && id){
      let cert = this.certificateInfo.find( c => c.certificate.id === id);
      if(cert) {
        if (cert.certifiedOriginExpirationDate > Date.now()) {
          return cert ? cert.certifiedOriginCode : '';
        } else {
          (<any>jQuery)('.modal').modal({backdrop: 'static', keyboard: false});
          this.certificateAlertMessage = `O certificado expirou em ${DateTimeHelper.toDDMMYYYY(cert.certifiedCustodyExpirationDate)}!“`;
          this.alertCertificateExpired.open(null);
        }
      }
    }
    return '';
  }

  onChange(event){
    this.form.controls['certifiedCustodyCode'].setValue(this.findCertifiedCustodyCode(event));
    this.form.controls['certifiedOriginCode'].setValue(this.findCertifiedOriginCode(event));
  }

  closeAlert(){
    this.alertCertificateExpired.close();
  }

  submit() {
    Object.keys(this.form.controls).forEach((key) => {
      this.form.controls[key].markAsDirty();
    });

    if (!this.form.valid) {
      return;
    }

    this.certificate.certificate = this.certificates.find(c => c.id === this.form.value.certificateId);
    this.certificate.certifiedCustodyCode = this.form.value.certifiedCustodyCode;
    this.certificate.certifiedOriginCode = this.form.value.certifiedOriginCode;

    this.save.emit(this.certificate);
    (<any>jQuery)('.modal').modal('hide');
  }



}
