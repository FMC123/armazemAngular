import { UserService } from '../../../user/user.service';
import { AuthService } from '../../../auth/auth.service';
import { BatchOperationService } from '../../../batch-operation/batch-operation.service';
import { FiscalNote } from '../../../fiscal-note/fiscal-note';
import { ErrorHandler } from '../../../shared/errors/error-handler';
import { User } from '../../../user/user';
import { WarehouseService } from '../../../warehouse/warehouse.service';
import { BalanceTransportationInService } from '../balance-transportation-in.service';

import {Component, Input, OnChanges, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {ParameterService} from "../../../parameter/parameter.service";

@Component({
  selector: 'app-balance-transportation-batch-operation-form',
  templateUrl: 'balance-transportation-batch-operation-form.component.html'
})

export class BalanceTransportationBatchOperationFormComponent implements OnInit, OnChanges {
  loading = false;
  form: FormGroup;
  users: Array<User>;
  balanceWeightingModes: Array<string>;
  submitted: boolean = false;


  @Input()
  weighingMode: string;

  constructor(
    private auth: AuthService,
    private balanceTransportationService: BalanceTransportationInService,
    private formBuilder: FormBuilder,
    private warehouseService: WarehouseService,
    private userService: UserService,
    private errorHandler: ErrorHandler,
    private batchOperationService: BatchOperationService,
    private parameterService: ParameterService
  ) { }

  ngOnInit() {
    this.userService.listByWarehouse(this.auth.accessToken.warehouse.id).then(data => {
      this.users = data;
    });

    this.batchOperationService.listBalanceWeightingModes().then((res) => {
      this.balanceWeightingModes = res;

    });
    this.weighingMode=this.parameterService.balanceWeightingMode()
    this.buildForm();
  }

  ngOnChanges(e) {
    if (!this.form){
      this.buildForm()
    }
    if (e && e.weighingMode && this.form) {
      this.weighingMode = e.weighingMode.currentValue;
      let mode = this.getBalanceMode();
      if (mode && mode!=='AMBOS') {
        this.form.controls['balanceWeightingMode'].disable();
        this.form.patchValue({balanceWeightingMode:mode});
      } else {
        this.form.controls['balanceWeightingMode'].enable();
        this.form.patchValue({balanceWeightingMode:''});
        this.form.markAsPristine();
      }
    }
  }

  buildForm() {
    if (this.form){
      return
    }
    let mode = this.getBalanceMode();
    this.form = this.formBuilder.group({
        'auditorId': ['', [Validators.required]],
        'balanceWeightingMode': ['', [Validators.required]],
      });

    if (mode==='INDIVIDUAL' || mode==='GERAL') {
      this.form.get('balanceWeightingMode').disable();
      this.form.get('balanceWeightingMode').setValue(mode);
    }
  }


  save() {
    this.submitted = true;
    Object.keys(this.form.controls).forEach((key) => {
      this.form.controls[key].markAsDirty();
    });
    if (!this.form.valid) {
      return;
    }
    this.loading = true;
    this.batchOperationService
      .createInBatchOperation(this.fiscalNotesSelected, this.form.value.auditorId, this.form.controls['balanceWeightingMode'].value)
      .then((batchOperation) => {
        this.loading = false;
        let mode=this.getBalanceMode();
        if (mode) {
          if (mode !== 'AMBOS') {
            this.form.controls['balanceWeightingMode'].disable();
          }
          else {
            this.form.patchValue({balanceWeightingMode: this.weighingMode || ''});
          }
        }
        this.form.patchValue({auditorId: ''});
        this.form.markAsPristine();
        this.fiscalNotesSelected.forEach(fiscalNote => {
          fiscalNote.batchOperation = batchOperation;
        });
      }).catch(error => {
        this.loading = false;
        this.handleError(error);
      });
  }

  getBalanceMode() {
    let mode = '';
    if (this.weighingMode) {
      mode = this.weighingMode;
    }
    return mode;
  }

  get transportation() {
    return this.balanceTransportationService.transportation;
  }

  get fiscalNotesSelected() {
    return this.balanceTransportationService.fiscalNotesSelected;
  }

  get selectedFiscalNotesMatch() {
    if (!this.fiscalNotesSelected) {
      return true;
    }

    if (this.fiscalNotesSelected.length <= 1) {
      return true;
    }

    let first = this.fiscalNotesSelected[0];

    const match = (fn: FiscalNote) => {
      if (fn.drink && !first.drink) {
        return false;
      }

      if (!fn.drink  && first.drink) {
        return false;
      }

      let drinkMatch = !fn.drink && !first.drink;
      if (!drinkMatch) {
        drinkMatch = fn.drink.id === first.drink.id;
      }

      return fn.ownerStakeholder.id === first.ownerStakeholder.id && drinkMatch;
    };

    return this.fiscalNotesSelected.every(match);
  }

  handleError(error) {
    this.loading = false;
    return this.errorHandler.fromServer(error);
  }

  isFiscalNotesSelected(){
    return !this.fiscalNotesSelected || this.fiscalNotesSelected.length == 0;
  }
}
