import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

import { BatchOperationCertificate } from './batch-operation-certificate';
import { BatchOperationCertificateService } from './batch-operation-certificate.service';
import { BatchOperation } from 'app/batch-operation/batch-operation';
import { ErrorHandler } from 'app/shared/errors/error-handler';
import { Logger } from 'app/shared/logger/logger';
import { Notification } from 'app/shared/notification/notification';
import { ModalManager } from 'app/shared/modals/modal-manager';
import {AuthService} from "../../auth/auth.service";

@Component({
  selector: 'app-batch-operation-certificate-list',
  templateUrl: 'batch-operation-certificate-list.component.html'
})

export class BatchOperationCertificateListComponent implements OnInit {

  @Input() batchOperation: BatchOperation;

  @Output() newCertificate: EventEmitter<boolean> = new EventEmitter<boolean>();

  loading: boolean;
  error: boolean;
  certificates: Array<BatchOperationCertificate>;
  deleteConfirm = new ModalManager();
  formModal = new ModalManager();

  constructor(
    private service: BatchOperationCertificateService,
    private auth: AuthService,
    private errorHandler: ErrorHandler,
    private logger: Logger,
  ) {}

  ngOnInit() {
    Notification.clearErrors();
    this.loadList();
  }

  delete(id: string) {
    this.loading = true;

    return this.service.delete(id).then(() => {
      return this.loadList();
    }).catch(error => {
      this.handleError(error);
    });
  }

  loadList() {
    this.error = false;
    this.loading = true;
    this.service
      .list(this.batchOperation.id, false)
      .then((certificates) => {
        this.loading = false;
        this.certificates = certificates;
      }).catch(error => this.handleError(error));
  }

  onFormClose(certificate) {

    if(certificate){
      this.newCertificate.emit(true);
    }

    this.formModal.close();
    this.loadList();

  }

  handleError(error) {
    this.error = true;
    this.loading = false;
    return this.errorHandler.fromServer(error);
  }

  isAdminForTransfer(){
    return this.batchOperation.type === 'OT_IN' ? (this.auth.accessToken.admin) : true;
  }

}
