import { environment } from '../../../environments/environment';
import { Focusable } from '../../shared/forms/focusable/focusable.directive';
import { Component, EventEmitter, Input, OnInit, Output, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ErrorHandler } from 'app/shared/errors/error-handler';
import { Company } from 'app/company/company';
import { Warehouse } from 'app/warehouse/warehouse';
import { ModalManager } from '../../shared/shared.module';
import { ReportFieldsInfo } from './report-fields-info';
import { ReportFieldsInfoService } from './report-fields-info.service';
import { Notification } from './../../shared/notification/notification';

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
  selector: 'app-report-fields-info-modal',
  templateUrl: './report-fields-info-modal.component.html'
})
export class ReportFieldsInfoModalComponent implements OnInit {
  @Output() close: EventEmitter<void> = new EventEmitter<void>(false);
  @ViewChildren(Focusable) focusables;
  @Input() company: Company;
  @Input() warehouse: Warehouse;
  // C - Company, W - Warehouse
  @Input() registrationType: string;

  form: FormGroup;
  loading = false;
  reportFieldsInfo: ReportFieldsInfo;

  filesErrors = [];
  maxFileSizeHuman: string = filesize(environment.MAX_CERTIFICATE_FILE_SIZE);

  file1x1: any = null;
  file4x1: any = null;

  deleteConfirm: ModalManager = new ModalManager();

  constructor(
    private formBuilder: FormBuilder,
    private errorHandler: ErrorHandler,
    private reportFieldsInfoService: ReportFieldsInfoService
  ) { }

  ngOnInit() {

    this.filesErrors['logo1x1'] = null;
    this.filesErrors['logo4x1'] = null;

    this.buildForm();

    let companyId = this.company.id;
    let warehouseId = (this.warehouse != null) ? this.warehouse.id : null;

    if (companyId != null) {
      this.reportFieldsInfoService.findByCompanyWarehouse(companyId, warehouseId).then(reportFieldsInfo => {
        this.reportFieldsInfo = reportFieldsInfo;
        this.buildForm();
      });
    }

  }

  ngOnDestroy() { }

  focusOnInput() {
    return () => {
      if (this.focusables && this.focusables.length > 0) {
        this.focusables.first.focus();
      }
    };
  }

  buildForm() {

    // quando é edição o nome vem do registro.
    // no cadastro é recuperado da campany ou warehouse
    let name = '';

    if (this.reportFieldsInfo != null) {
      name = this.reportFieldsInfo.name;
    }
    else {
      if (this.warehouse != null) {
        name = this.warehouse.name;
      } else if (this.company != null) {
        name = this.company.name;
      }
    }

    this.form = this.formBuilder.group({
      id: [(this.reportFieldsInfo != null) ? this.reportFieldsInfo.id : ''],
      companyInfo: [(this.company) ? this.company.name : ''],
      warehouseInfo: [(this.warehouse) ? this.warehouse.name : ''],
      name: [name ? name : ''],
      cnpj: [(this.reportFieldsInfo != null) ? this.reportFieldsInfo.cnpj : ''],
      stateRegistration: [(this.reportFieldsInfo != null) ? this.reportFieldsInfo.stateRegistration : ''],
      phone: [(this.reportFieldsInfo != null) ? this.reportFieldsInfo.phone : ''],
      address: [(this.reportFieldsInfo != null) ? this.reportFieldsInfo.address : ''],
      foundationInfo: [(this.reportFieldsInfo != null) ? this.reportFieldsInfo.foundationInfo : ''],
      logo1x1Bytes: [(this.reportFieldsInfo != null) ? this.reportFieldsInfo.logo1x1Bytes : ''],
      logo4x1Bytes: [(this.reportFieldsInfo != null) ? this.reportFieldsInfo.logo4x1Bytes : ''],
      warehouseManager: [(this.reportFieldsInfo != null) ? this.reportFieldsInfo.warehouseManager:''],
      prosecutor: [(this.reportFieldsInfo != null) ? this.reportFieldsInfo.prosecutor:''],
      endorsement: [(this.reportFieldsInfo != null) ? this.reportFieldsInfo.endorsement:''],
    });
  }

  submit() {
    Object.keys(this.form.controls).forEach((key) => {
      this.form.controls[key].markAsDirty();
    });

    this.validateFiles();

    if (!this.form.valid || this.filesErrors['logo1x1'] || this.filesErrors['logo4x1']) {
      return;
    }

    if (this.reportFieldsInfo == null) {
      this.reportFieldsInfo = new ReportFieldsInfo();
    }

    this.reportFieldsInfo.id = this.form.value.id;
    this.reportFieldsInfo.company = this.company;
    this.reportFieldsInfo.warehouse = this.warehouse;
    this.reportFieldsInfo.name = this.form.value.name;
    this.reportFieldsInfo.cnpj = this.form.value.cnpj;
    this.reportFieldsInfo.stateRegistration = this.form.value.stateRegistration;
    this.reportFieldsInfo.phone = this.form.value.phone;
    this.reportFieldsInfo.address = this.form.value.address;
    this.reportFieldsInfo.foundationInfo = this.form.value.foundationInfo;
    this.reportFieldsInfo.warehouseManager = this.form.value.warehouseManager;
    this.reportFieldsInfo.prosecutor = this.form.value.prosecutor;
    this.reportFieldsInfo.endorsement = this.form.value.endorsement;

    this.loading = true;
    this.reportFieldsInfoService.saveWithFile(this.reportFieldsInfo, this.file1x1, this.file4x1).then(() => {
      this.loading = false;
      Notification.success('Cabeçalho padrão salvo com sucesso!');
      (<any>jQuery)('.modal').modal('hide');
    }).catch((error) => this.handleError(error));
  }

  handleError(error) {
    this.loading = false;
    return this.errorHandler.fromServer(error);
  }

  /**
   * Para verificar se é cadastro de cabeçalho para o Armazém
   */
  isWarehouseHeader() {

    if (this.registrationType != null && this.registrationType == 'W') {
      return true;
    }

    return false;
  }

  editing() {
    return (this.reportFieldsInfo != null && this.reportFieldsInfo.id != null) ? true : false;
  }

  fileChange(event, name) {

    this.filesErrors[name] = null;

    let files = event.srcElement.files;
    if (!files || !files.length) {
      this.setImage(null, name);
      return;
    }

    this.setImage(files[0], name);
  }

  setImage(file, name) {
    if (name == 'logo1x1') {
      this.file1x1 = file;

      if (this.reportFieldsInfo != null) {
        this.reportFieldsInfo.removeLogo1x1 = false;
      }
    }
    else {
      this.file4x1 = file;

      if (this.reportFieldsInfo != null) {
        this.reportFieldsInfo.removeLogo4x1 = false;
      }
    }
  }

  validateFiles() {
    this.validateFile(this.file1x1, 'logo1x1');
    this.validateFile(this.file4x1, 'logo4x1');
  }

  validateFile(file, name) {

    // imagem não é obrigatória
    if (!file) {
      return;
    }

    if (!file) {
      if (!this.editing()) {
        if (!this.filesErrors) this.filesErrors[name] = {};
        this.filesErrors[name]['required'] = true;
      }
      return;
    }

    let validType = VALID_IMAGE_TYPES.some((it) => it === file.type);
    if (!validType) {
      if (!this.filesErrors[name]) this.filesErrors[name] = {};
      this.filesErrors[name]['invalidType'] = true;
    }

    let maxFileSize = environment.MAX_CERTIFICATE_FILE_SIZE;
    if (file.size > maxFileSize) {
      if (!this.filesErrors[name]) this.filesErrors[name] = {};
      this.filesErrors[name]['invalidSize'] = true;
    }
  }

  removeImage1x1() {
    this.reportFieldsInfo.logo1x1Bytes = null;
    this.reportFieldsInfo.logo1x1ContentType = null;
    this.reportFieldsInfo.logo1x1Filename = null;
    // precisa especificar para limpar na base de dados
    this.reportFieldsInfo.removeLogo1x1 = true;
  }

  removeImage4x1() {
    this.reportFieldsInfo.logo4x1Bytes = null;
    this.reportFieldsInfo.logo4x1ContentType = null;
    this.reportFieldsInfo.logo4x1Filename = null;
    // precisa especificar para limpar na base de dados
    this.reportFieldsInfo.removeLogo4x1 = true;
  }

  delete() {
    let id = this.reportFieldsInfo.id;
    this.loading = true;
    this.reportFieldsInfoService.delete(id).then(() => {
      this.loading = false;
      Notification.success('Excluído com sucesso!');
      (<any>jQuery)('.modal').modal('hide');
    }).catch(error => this.handleError(error));
  }
}
