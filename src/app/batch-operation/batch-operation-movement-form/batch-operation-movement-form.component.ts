import { Masks } from '../../shared/forms/masks/masks';
import { ErrorHandler } from '../../shared/errors/error-handler';
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BatchOperationMovement } from './batch-operation-movement';
import { Warehouse } from '../../warehouse/warehouse';
import { Batch } from '../../batch/batch';
import { Notification } from '../../shared/notification';
import { AuthService } from "../../auth/auth.service";
import {BatchOperationService} from "./../batch-operation.service";

import { WarehouseStakeholderAutocomplete } from '../../warehouse-stakeholder/warehouse-stakeholder-autocomplete';
import {Http} from "@angular/http";
import {Endpoints} from "../../endpoints";
import {ParameterService} from "../../parameter/parameter.service";

@Component({
  selector: 'app-batch-operation-movement-form',
  templateUrl: './batch-operation-movement-form.component.html'
})
export class BatchOperationMovementFormComponent implements OnInit, OnDestroy {

  form: FormGroup;
  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private errorHandler: ErrorHandler,
    private service: BatchOperationService,
    private parameterService: ParameterService
  ) { }

  loading: boolean = false;
  public hasOwnershipTransferPermission: boolean = false;
  public hasBatchSwapPermission: boolean = false;
  public batchSwapParameter = this.parameterService.batchSwapExpocaccerValue();

  ngOnInit() {
    Notification.clearErrors();
    this.buildForm();
    this.loading = true;
    this.service.batchOperationPermissions().then(response => {
      this.loading = false;
      this.hasOwnershipTransferPermission = response.json().includes('OWNERSHIP_TRANSFER', 0);
      this.hasBatchSwapPermission = response.json().includes('BATCH_SWAP', 0);
    }).catch(()=>{
      this.loading = false;
    });
  }

  ngOnDestroy() {

  }

  buildForm() {

    this.form = this.formBuilder.group({
      'movementType': ['', Validators.required ]
    });

  }

  hiddenTransferForm(selectdTransfer: String) {
    return this.form.controls['movementType'].value != selectdTransfer;
  }

  handleError(error) {
    this.loading = false;
    return this.errorHandler.fromServer(error);
  }



}
