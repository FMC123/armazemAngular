import {Component, Input, Output, EventEmitter, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Batch} from "../../batch/batch";
import {BatchOperation} from "../../batch-operation/batch-operation";
import {WarehouseStakeholder} from "../../warehouse-stakeholder/warehouse-stakeholder";
import {BatchStatus} from "../../batch/batch-status";
import {BatchService} from "../../batch/batch.service";
import {Autocomplete} from "../forms/autocomplete/autocomplete";
import {BatchFilterAutocomplete} from "../../batch/batch-filter-autocomplete";
import {ErrorHandler} from "../errors/error-handler";
import {Observable, Subscription} from "rxjs";
import {MarkupGroupBatch} from "../../markup-group/batch/markup-group-batch";
import {AuthService} from "../../auth/auth.service";
import {Notification} from "../notification";
import {ParameterService} from "../../parameter/parameter.service";

@Component({
  selector: 'app-receipt',
  templateUrl: './receipt.component.html'
})

export class ReceiptComponent implements OnInit {
  @Input() message: string;
  @Input() yesLabel: string;
  @Input() noLabel: string;
  @Input() buttonClass = 'btn-success';
  @Input() showLabelNo: string = 'true';
  @Input() ownerId: string;
  @Input() markupGroupBatch: MarkupGroupBatch;
  @Output() confirm = new EventEmitter();
  @Output() close = new EventEmitter();

  form: FormGroup;
  loading: boolean = false;
  listaPesquisaLotes: Array<any>;
  nenhumLoteEncontrado: boolean;
  batchAutocomplete: Autocomplete;
  batchSubscription: Subscription;
  batch: Batch;

  constructor(
    private errorHandler: ErrorHandler,
    private formBuilder: FormBuilder,
    private batchService: BatchService,
    private auth: AuthService,
    private parameterService: ParameterService
  ) {

  }

  ngOnInit(): void {
    this.batchAutocomplete = new BatchFilterAutocomplete(this.batchService, this.errorHandler);
    this.buildForm();
    let filterBatch = Batch.fromData({batchCode: this.markupGroupBatch.batch.batchCode});
    Observable.fromPromise(this.batchService.listFilter(filterBatch, true)
      .catch((error) => this.errorHandler.fromServer(error)))
      .subscribe((batch) => {
        if (batch[0]) {
          this.batchAutocomplete.value = this.markupGroupBatch.batch;
          this.batch = batch[0];
        } else {
          this.batchAutocomplete.value = null;
          this.batch = null;
        }
      });
  }

  buildForm() {
    this.form = this.formBuilder.group({
      buscar_por_cod_lote: ['', [Validators.required]]
    });
    this.batchSubscription = this.batchAutocomplete.valueChange.subscribe((value) => {
      const id = value ? value.id : null;
      this.form.get('buscar_por_cod_lote').setValue(id);
      this.batch = this.batchAutocomplete.value;
    });
  }

  executeConfirm() {
    Object.keys(this.form.controls).forEach(key => {
      this.form.controls[key].markAsDirty();
    });
    if (!this.form.valid) {
      return;
    }

    if(!this.parameterService.specificParamsServiceInstructionWahehouseGeneral()
    && !this.markupGroupBatch.batch.localWithAuth(this.auth) && this.batch.batchCode != this.markupGroupBatch.batch.batchCode){
      Notification.error('O Lote informado não é o mesmo lote da instrução de serviço!')
      return;
    }

    this.loading = true;
    this.markupGroupBatch.selectedToProccess = true;

    this.confirm.emit({batchId: this.batch.id, markupGroupBatchId: this.markupGroupBatch.id});
  }

  pesquisar() {
    this.loading = true;
    this.listaPesquisaLotes = [];
    let filter: Batch = null;

    if (this.form.get('buscar_por_cod_lote').value != '') {
      filter = new Batch();
      filter.batchCode = this.form.get('buscar_por_cod_lote').value;
      filter.batchOperation = new BatchOperation();
      filter.batchOperation.owner = new WarehouseStakeholder();
      filter.batchOperation.owner.id = this.ownerId;
    }

    if (filter != null) {
      // somente lotes recebidos
      filter.status = BatchStatus.RECEIVED.code;
      this.batchService.listFilter(filter).then(batches => {
        this.listaPesquisaLotes = batches;
        this.loading = false;
        this.nenhumLoteEncontrado = (this.listaPesquisaLotes == null || this.listaPesquisaLotes.length == 0);
      }).catch(error => {
        console.log(error, 'Deu ruim?')
      });
    } else {
      this.nenhumLoteEncontrado = null;
      this.loading = false;
    }
  }
}
