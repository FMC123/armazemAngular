import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {BatchService} from "../batch.service";
import {BatchAutocomplete} from "../batch-autocomplete";
import {ErrorHandler} from "../../shared/errors/error-handler";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Subscription} from "rxjs";
import {Batch} from "../batch";
import {BatchOperationOwnershipTransfer} from "../../batch-operation/batch-operation-movement-form/batch-operation-ownership-transfer-form/batch-operation-ownership-transfer";
import {Notification} from "../../shared/notification";

@Component({
  selector: 'app-batch-report',
  templateUrl: 'batch-batchcode-update.component.html'
})

export class BatchBatchcodeUpdateComponent implements OnInit, OnDestroy {

  batchAutocomplete: BatchAutocomplete;
  form: FormGroup;
  loading: boolean = false;
  batchSubscription: Subscription;
  batchOriginSelected: Batch;
  batchNewSelected: Batch;

  constructor(
    private batchService: BatchService,
    private errorHandler: ErrorHandler,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {

    this.batchAutocomplete = new BatchAutocomplete(
      this.batchService,
      this.errorHandler
    );

    this.buildForm();

  }

  ngOnDestroy() {
    if (this.batchSubscription != null && !this.batchSubscription.closed) {
      this.batchSubscription.unsubscribe();
    }
  }

  buildForm() {
    this.form = this.formBuilder.group({
      'batchOriginCode': ['', Validators.required ],
      'batchNewCode': ['', Validators.required ]
    });

    this.batchAutocomplete.value = null;

    this.batchSubscription = this.batchAutocomplete.valueChange.subscribe((value) => {
      const code = value ? value.batchCode : null;
      this.form.get('batchOriginCode').setValue(code);
      this.batchOriginSelected = value;
    });
  }

  save() {
    Object.keys(this.form.controls).forEach((key) => {
      this.form.controls[key].markAsDirty();
    });

    if (!this.form.valid) {
      return;
    }

    this.batchNewSelected = new Batch();
    this.batchNewSelected.id = this.batchOriginSelected.id;
    this.batchNewSelected.batchCode = this.form.value.batchNewCode;
    this.loading = true;

    this.batchService.updateBatchCode(this.batchNewSelected)
      .then((result: any) => {
        this.loading = false;
        if(result.errorMsg && result.errorMsg != '')
        {
          Notification.error(result.errorMsg);
        }
        else
        {
          Notification.success('Alteração do número do lote salva com sucesso!');
          this.buildForm();
        }
      }).catch((error) => this.handleError(error));
  }

  handleError(error) {
    this.loading = false;
    return this.errorHandler.fromServer(error);
  }
}
