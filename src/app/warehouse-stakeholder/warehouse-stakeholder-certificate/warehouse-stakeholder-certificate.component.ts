import {Component, Input, OnInit} from '@angular/core';
import {WarehouseStakeholderCertificate} from "./warehouse-stakeholder-certificate";
import {WarehouseStakeholderCertificateService} from "./warehouse-stakeholder-certificate.service";
import {ModalManager} from "../../shared/modals/modal-manager";
import {ErrorHandler} from "../../shared/errors/error-handler";
import {WarehouseStakeholder} from "../warehouse-stakeholder";

@Component({
  selector: 'app-warehouse-stakeholder-certificate',
  templateUrl: './warehouse-stakeholder-certificate.component.html',
})
export class WarehouseStakeholderCertificateComponent implements OnInit {
  @Input() stakeholder: WarehouseStakeholder;
  @Input() editable : boolean = true;
  certificates: Array<WarehouseStakeholderCertificate> = [];
  openCreationModal: boolean = false;
  error: boolean;

  deleteConfirm = new ModalManager();
  formModal = new ModalManager();
  loadingList = true;


  constructor(
    private certificateService: WarehouseStakeholderCertificateService,
    private errorHandler: ErrorHandler,) {
  }

  ngOnInit() {
    this.loadList();
  }

  loadList() {
    this.loadingList = true;
    if(this.stakeholder) {
      this.certificateService.listValidByStakeholder(this.stakeholder.id).then(
        (wsCertificates) => {
          this.certificates = wsCertificates;
        })
    } else {
      this.certificateService.listAllValidByWarehouse().then(
        (wsCertificates) => {
          this.certificates = wsCertificates;
        })
    }
    this.loadingList = false;
  }

  onFormClose() {
    this.formModal.close();
    this.loadList();

  }

  delete(id: string) {

    return this.certificateService.delete(id).then(() => {
      this.loadingList = true;
      return this.loadList()
    }).catch(err => this.handleError(err));
  }

  handleError(error) {
    this.error = true;
    this.loadingList = false;
    return this.errorHandler.fromServer(error);
  }

}
