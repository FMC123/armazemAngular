import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs/Rx';
import { ErrorHandler } from '../../shared/errors/error-handler';
import { Logger } from '../../shared/logger/logger';
import { ModalManager } from '../../shared/modals/modal-manager';
import { Notification } from '../../shared/notification';
import { Page } from '../../shared/page/page';
import { ServiceInstructionListFilter } from './service-instruction-list-filter';
import { ServiceInstruction } from '../service-instruction';
import { ServiceInstructionService } from '../service-instruction.service';
import { ServiceInstructionStatus } from '../service-instruction-status';
import {Sample} from "../../sample/sample";
import {Batch} from "../../batch/batch";
import {Endpoints} from "../../endpoints";
import {Http, ResponseContentType, URLSearchParams} from "@angular/http";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {CustomValidators} from "../../shared/forms/validators/custom-validators";
import {Masks} from "../../shared/forms/masks/masks";

@Component({
  selector: 'app-service-instruction-list',
  templateUrl: 'service-instruction-list.component.html'
})
export class ServiceInstructionListComponent implements OnInit, OnDestroy {
  loading: boolean;
  error: boolean;
  page: Page<ServiceInstruction> = new Page<ServiceInstruction>();
  filter = new ServiceInstructionListFilter();
  deleteConfirm = new ModalManager();
  isArmazemGeral: boolean = false;
  batches: Batch[];
  formFitilho: FormGroup;
  batchIdSelected: string;
  opcoesRelFitilhoModal = new ModalManager();

  integerMask = Masks.integerMask;

  constructor(
    private service: ServiceInstructionService,
    private errorHandler: ErrorHandler,
    private router: Router,
    private http: Http,
    private logger: Logger,
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit() {
    Notification.clearErrors();
    this.buildForm();
    this.loadList();
    this.page.changeQuery.subscribe(() => {
      this.loadList();
    });
    this.isArmazemGeral = this.service.isArmazemGeral();
  }

  buildForm() {
    let group = {
      'batchIdSelectedId': ['', [Validators.required]],
      'qtdeVias': [3, [Validators.required, CustomValidators.minValidator(1)]],
    };

    this.formFitilho = this.formBuilder.group(group);
  }

  ngOnDestroy() {
    this.page.changeQuery.unsubscribe();
  }

  filterList(filter) {
    this.filter = filter;
    this.loadList();
  }

  loadList(skipLoading = false) {
    this.error = false;

    if (!skipLoading) {
      this.loading = true;
    }

    this.service
      .listPaged(this.filter, this.page)
      .then(() => {
        this.loading = false;
      })
      .catch(error => this.handleError(error));
  }

  handleError(error) {
    this.error = true;
    this.loading = false;
    return this.errorHandler.fromServer(error);
  }

  canEditServiceInstruction(serviceInstruction: ServiceInstruction) {
    let canEdit = true;
    canEdit = ServiceInstructionStatus.CANCELED.code === serviceInstruction.status ? false : canEdit;
    canEdit = ServiceInstructionStatus.FINISHED.code === serviceInstruction.status ? false : canEdit;
    return canEdit;
  }

  imprimir(serviceInstruction: ServiceInstruction) {
    this.loading = true;
    this.service.printOrientation(serviceInstruction.id)
    .catch(error => this.handleError(error))
    .then(() => {
      this.loading = false;
    });
    this.service.printProportionalEvictionReport(serviceInstruction.id)
      .catch(error => this.handleError(error));
  }

  printFitilho(serviceInstruction: ServiceInstruction) {
    this.service.listBatchsByServiceInstruction(serviceInstruction.id).then(value =>{
      this.batches = value;
      this.opcoesRelFitilhoModal.open(null);
    } );
  }

  gerarRelatorioFitilho() {

    //this.batches.forEach(b => {
      // imprime relatório
    this.loading = true;
    let params = new URLSearchParams();
    //params.append('sampleId', b.sample.id);
    params.append('batchId', this.formFitilho.get('batchIdSelectedId').value);
    params.append('printQuantity', this.formFitilho.get('qtdeVias').value);

      this.http.get(Endpoints.reportSamplePrintRibbonServiceInstructionUrl, {
        responseType: ResponseContentType.Blob,
        search: params
      }).toPromise().then(response => {
        let url = window.URL.createObjectURL(response.blob());
        window.open(url);
        // fecha modal
        (<any>jQuery)('.modal').modal('hide');
        this.loading = false;

      }).catch((error) => {
        this.handleError(error);
        // fecha modal
        (<any>jQuery)('.modal').modal('hide');
      });

    // });
  }

}
