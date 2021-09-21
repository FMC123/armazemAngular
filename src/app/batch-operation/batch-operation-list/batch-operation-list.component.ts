import { BatchOperationType } from '../batch-operation-type';
import { Notification } from '../../shared/notification';
import { ErrorHandler } from '../../shared/errors/error-handler';
import { Logger } from '../../shared/logger/logger';
import { Router } from '@angular/router';
import { BatchOperationService } from '../batch-operation.service';
import { BatchOperationFilter } from './batch-operation-filter';
import { ModalManager } from '../../shared/modals/modal-manager';
import { BatchOperation } from '../batch-operation';
import { Observable, Subscription } from 'rxjs/Rx';
import { Page } from '../../shared/page/page';
import { Component, OnDestroy, OnInit } from '@angular/core';
import {TypeCoffee} from "../../pack-type/type-coffee";
import {Batch} from "../../batch/batch";
import {BatchOperationOwnershipTransfer} from "../batch-operation-movement-form/batch-operation-ownership-transfer-form/batch-operation-ownership-transfer";
import {ParameterService} from "../../parameter/parameter.service";
import {AccessTokenService} from "../../access-token/access-token.service";
import {UserService} from "../../user/user.service";
import {AuthService} from "../../auth/auth.service";
import {AppState} from "../../app-state.service";
import {RouterHelperService} from "../../shared/router-helper/router-helper.service";
import {Http, ResponseContentType, URLSearchParams} from "@angular/http";
import {Endpoints} from "../../endpoints";
import {CustomValidators} from "../../shared/forms/validators/custom-validators";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Masks} from "../../shared/forms/masks/masks";

@Component({
  selector: 'app-batch-operation-list',
  templateUrl: 'batch-operation-list.component.html'
})

export class BatchOperationListComponent implements OnInit, OnDestroy {
  loading: boolean;
  error: boolean;
  page: Page<BatchOperation> = new Page<BatchOperation>();
  refresherSubscription: Subscription;
  filter = new BatchOperationFilter();
  deleteConfirm = new ModalManager();
  cancelConfirm = new ModalManager();
  isArmazemGeral:boolean = false;
  types = BatchOperationType.list();
  batchsOperationOwnershipTransfer:  BatchOperationOwnershipTransfer[] = [];

  filterChangedData: any = null;

  formFitilho: FormGroup;
  batches: Batch[];
  opcoesRelFitilhoModal = new ModalManager();
  integerMask = Masks.integerMask;

  constructor(
    private service: BatchOperationService,
    private parameterService: ParameterService,
    private auth: AuthService,
    private errorHandler: ErrorHandler,
    private router: Router,
    private logger: Logger,
    private http: Http,
    private formBuilder: FormBuilder,
    private routerHelper: RouterHelperService,
    private state: AppState
  ) {}

  ngOnInit() {
    Notification.clearErrors();
    this.buildForm();
    // this.loadList();
    this.page.changeQuery.subscribe(() => {
      this.loadList();
    });
    this.loadPreviousData()
    this.loadList();
    this.setupAutoRefresher();
    this.isArmazemGeral = this.service.isArmazemGeral()
  }

  buildForm() {
    let group = {
      'batchIdSelectedId': ['', [Validators.required]],
      'batchOperationId': ['', [Validators.required]],
      'qtdeVias': [3, [Validators.required, CustomValidators.minValidator(1)]],
      'ref': [''],
      'sender': [''],
      'senderTitle':[''],
      'provenance': [''],
    };

    this.formFitilho = this.formBuilder.group(group);
  }

  ngOnDestroy() {
    if (this.refresherSubscription && !this.refresherSubscription.closed) {
      this.refresherSubscription.unsubscribe();
    }

    this.refresherSubscription = null;

    this.page.changeQuery.unsubscribe();
  }

  setupAutoRefresher() {
    this.refresherSubscription = Observable.timer(5000, 5000).subscribe(() => {
      this.loadList(true);
    });
  }

  filterList(filter) {
    this.filter = filter;
    this.loadList();
  }

  loadList(
    skipLoading = false,
  ) {
    this.error = false;

    if (!skipLoading) {
      this.loading = true;
    }

    this.service
      .listPaged(this.filter, this.page)
      .then(() => {
        this.loading = false;
      }).catch(error => this.handleError(error));
  }

  delete(
    id: string
  ) {
    this.loading = true;
    return this.service
      .delete(id)
      .then(() => {
        Notification.success('Entrada/Saída de lote excluída com sucesso!');
        this.loadList();
      })
      .catch(error => this.handleError(error));
  }

  cancelTransfer(
    batchOperation: BatchOperation
  ) {
    this.batchsOperationOwnershipTransfer = [];
    this.loading = true;
    let batchDestiny:Batch = null;
    for (const batch of batchOperation.batches) {
      if(batch.batchReference)
      {
        batchDestiny = batch;
        let batchOperationOwnershipTransfer:BatchOperationOwnershipTransfer = new BatchOperationOwnershipTransfer();
        batchOperationOwnershipTransfer.warehouse = batchOperation.warehouse.code;
        batchOperationOwnershipTransfer.batchOrigin = batchDestiny.batchReference.batchCode;
        batchOperationOwnershipTransfer.batchDestiny = batchDestiny.batchCode;
        if(this.parameterService.specificParamsServiceInstructionWahehouseGeneral())
        {
          batchOperationOwnershipTransfer.personDocumentRegistration = batchOperation.owner.person.document;
        }
        else
        {
          batchOperationOwnershipTransfer.collaboratorRegistration = batchOperation.collaborator.code;
        }
        batchOperationOwnershipTransfer.quantityTransfer = batchDestiny.netWeight.toString();
        batchOperationOwnershipTransfer.quantityBags = batchDestiny.netQuantity.toString();
        batchOperationOwnershipTransfer.surplusTransfer = false;
        batchOperationOwnershipTransfer.cancelTransfer = true;
        this.batchsOperationOwnershipTransfer.push(batchOperationOwnershipTransfer);
      }
    }

    return this.service
      .cancelOwnershipTransferByList(this.batchsOperationOwnershipTransfer)
      .then(() => {
        Notification.success('Entrada/Saída de lote cancelada com sucesso!');
        this.loadList();
      })
      .catch(error => this.handleError(error));
  }

  submitPdf(batchOperationId: string) {
    this.loading = true;
    let blob: Promise<Blob> = this.service.relatorioEntradaRomaneio(batchOperationId);
    blob.then((b) => {
      if (b.size === 0) {
        Notification.error('Não foi encontrado informações para abrir o relatório!');
      } else {
        let urlReport = window.URL.createObjectURL(b);
        window.open(urlReport);
      }
      this.loading = false;
    });
  }

  submitExitReportPdf(batchOperationId: string) {
    this.loading = true;
    let blob: Promise<Blob> = this.service.relatorioSaidaRomaneio(batchOperationId);
    blob.then((b) => {
      if (b.size === 0) {
        Notification.error('Não foi encontrado informações para abrir o relatório!');
      } else {
        let urlReport = window.URL.createObjectURL(b);
        window.open(urlReport);
      }
      this.loading = false;
    });
  }

  submitWeightPdf(batchOperationId: string) {
    this.loading = true;
    let blob: Promise<Blob> = this.service.relatorioEntradaRomaneioPeso(batchOperationId);
    blob.then((b) => {
      if (b.size === 0) {
        Notification.error('Não foi encontrado informações para abrir o relatório!');
      } else {
        let urlReport = window.URL.createObjectURL(b);
        window.open(urlReport);
      }
      this.loading = false;
    });
  }

  /**
   * Para trocar opção de mostrar ou não em dispositivos móveis
   *
   * @param batchOperationId
   * @param showOnMobileDevices
   */
  switchShowOnMobile(batchOperationId: string, showOnMobileDevices: boolean) {
    this.loading = true;
    return this.service
      .switchShowOnMobile(batchOperationId, showOnMobileDevices)
      .then(() => {
        Notification.success('Troca de opção para exibir nos dispositivos móveis realizada com sucesso!');
        this.loadList();
      })
      .catch(error => this.handleError(error));
  }

  handleError(error) {
    this.error = true;
    this.loading = false;
    return this.errorHandler.fromServer(error);
  }

  /**
   * Recupera o nome do colaborador para exibição
   *
   * @param batchOperation
   */
  getCollaboratorName(batchOperation: BatchOperation) {
    if(batchOperation.type === BatchOperationType.W_OUT.code) {
      if(batchOperation.markupGroup !== undefined && batchOperation.markupGroup !== null) {
        return batchOperation.markupGroup.ownersBatchesNamesWithDocuments;
      }
    }
    if (batchOperation.collaborator != null && batchOperation.collaborator.person != null) {
      return batchOperation.collaborator.label;
    }
    else if (batchOperation.owner != null && batchOperation.owner.person != null) {
      return batchOperation.owner.label;
    }

    return "";
  }

  private loadPreviousData() {
    let filterData = this.state.getData('BATCH_OPERATION_FILTER');
    if (filterData) {
      this.filter = BatchOperationFilter.fromData(filterData);
    }
    let pageData = this.state.getData('BATCH_OPERATION_PAGE');
    if (pageData) {
      this.page.currentPage = pageData.currentPage;
    }
  }

  navigateToMovement(): void {
    this.routerHelper.addUrl(this.router);
    this.state.setData('BATCH_OPERATION_PAGE', this.page);
    this.router.navigate(['batch-operation/movement']);
  }

  navigateToDetail(batchOperation): void {
    this.routerHelper.addUrl(this.router);
    this.state.setData('BATCH_OPERATION_PAGE', this.page);
    this.router.navigate(['/batch-operation', batchOperation.id, 'detail']);
  }

  navigateToEdit(batchOperation): void {
    this.routerHelper.addUrl(this.router);
    this.state.setData('BATCH_OPERATION_PAGE', this.page);
    this.router.navigate(['/batch-operation', batchOperation.typeObject.route.toLowerCase(), batchOperation.id, 'edit']);
  }

  get isAdmin() : boolean{
    return this.auth.accessToken.admin || this.auth.accessToken.leader;
  }

  /**
   * Opções para impressão do relatório de Fitilho
   */
  printFitilho(batchOperation: BatchOperation) {
    // console
    // if(batchOperation && batchOperation.batches){
    this.batches = batchOperation.batches;
    this.formFitilho.get('batchOperationId').setValue(batchOperation.id);
    this.opcoesRelFitilhoModal.open(null);
    // }
  }

  /**
   * Geração do relatório de Fitilho
   */
  gerarRelatorioFitilho() {

    //this.batches.forEach(b => {
    // imprime relatório
    this.loading = true;
    let params = new URLSearchParams();
    //params.append('sampleId', b.sample.id);
    params.append('batchId', this.formFitilho.get('batchIdSelectedId').value);
    params.append('batchOperationId', this.formFitilho.get('batchOperationId').value);
    params.append('printQuantity', this.formFitilho.get('qtdeVias').value);
    params.append('ref', this.formFitilho.get('ref').value);
    params.append('sender', this.formFitilho.get('sender').value);
    params.append('provenance', this.formFitilho.get('provenance').value);
    params.append('senderTitle', this.formFitilho.get('senderTitle').value);
    this.http.get(Endpoints.reportSamplePrintRibbonBatchOperationUrl, {
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
