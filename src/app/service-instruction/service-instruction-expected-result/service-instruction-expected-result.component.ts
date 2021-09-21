import { Component, Input, OnInit, OnDestroy, SimpleChanges, SimpleChange, OnChanges, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { ErrorHandler } from '../../shared/errors/error-handler';
import { Subscription } from 'rxjs/Rx';
import { ServiceInstruction } from '../service-instruction';
import { Strainer } from '../../strainer/strainer';
import { StrainerService } from '../../strainer/strainer.service';
import { ExpectedResult } from '../expected-result';
import { Masks } from '../../shared/forms/masks/masks';
import { DateTimeHelper, NumberHelper } from 'app/shared/globalization';
import { MarkupGroupBatch } from 'app/markup-group/batch/markup-group-batch';
import { AuthService } from 'app/auth/auth.service';
@Component({
  selector: 'app-service-instruction-expected-result',
  templateUrl: './service-instruction-expected-result.component.html'
})
export class ServiceInstructionExpectedResultComponent implements OnInit {

  @Input('serviceInstruction') serviceInstruction: ServiceInstruction;
  @Input('isEditable') isEditable: boolean;
  @Input() isModal: boolean;
  @Input('averageWeightSacksString') averageWeightSacksString: string;
  @Input() expectedResults: Array<ExpectedResult> = [];
  @Input() taskBatches: Array<MarkupGroupBatch> = [];

  form: FormGroup;
  loading: boolean = false;
  integerMask = Masks.integerMask;
  decimalMask = Masks.decimalMask;
  strainers: Array<Strainer> = [];
  expectedResultEditing: ExpectedResult;
  createBatchWhenConfirmSubscription: Subscription;

  avaibleTaskMgb: Array<MarkupGroupBatch> = new Array();

  get editing() {
    return !!this.serviceInstruction && !!this.serviceInstruction.id;
  }

  constructor(
    private auth: AuthService,
    private strainerService: StrainerService,
    private formBuilder: FormBuilder,
    private errorHandler: ErrorHandler

  ) {

   }

  ngOnInit() {
    this.buildForm(new ExpectedResult());

    this.strainerService.list().then(strainers => {
      this.strainers = strainers;
    });

    // atualiza resultado esperado
    var obj = this;
    setInterval(function () {
      obj.atualizarListaResultadoEsperado();
    }, 2000);
  }

  ngOnDestroy() {
    if (this.createBatchWhenConfirmSubscription && !this.createBatchWhenConfirmSubscription.closed) {
      this.createBatchWhenConfirmSubscription.unsubscribe();
    }
  }

  buildForm(expectedResult: ExpectedResult) {
    this.form = this.formBuilder.group({
      percentage: [expectedResult.percentage || '', Validators.required],
      quantity: [expectedResult.quantity || '', Validators.required],
      observation: [expectedResult.observation || ''],
      strainerId: [expectedResult.strainer ? expectedResult.strainer.id || '' : '', Validators.required],
      quantitySacks: [expectedResult.quantitySacks || '', Validators.required],
      createBatchWhenConfirm: [expectedResult.createBatchWhenConfirm || false],
      batchResult: [expectedResult.batchResult || ''],
    });

    this.createBatchWhenConfirmSubscription = this.form.get('createBatchWhenConfirm').valueChanges.subscribe((value) => {
      this.changeFieldBatchResult(value);
    });
  }

  changeFieldBatchResult(value){
    if(value)
    {
      this.form.get('batchResult').enable();
    }
    else {
      this.form.get('batchResult').disable();
      this.form.get('batchResult').setValue("");
    }
  }

  save() {
    Object.keys(this.form.controls).forEach(key => {
      this.form.controls[key].markAsDirty();
    });


    if (!this.form.valid) {
      return;
    }

    let expectedResult = (this.expectedResultEditing)
      ? this.expectedResultEditing
      : new ExpectedResult();

    if (this.form.value.quantity > 0){
      let averageWeightBagString = +this.serviceInstruction.averageWeightBagString;
      expectedResult.totalSacksQuantity = this.form.value.quantity / averageWeightBagString;
    }else{
      expectedResult.totalSacksQuantity = 0;
    }
    expectedResult.percentage = this.form.value.percentage;
    expectedResult.quantity = this.form.value.quantity;
    expectedResult.observation = this.form.value.observation;
    expectedResult.strainer = this.strainers.find(s => s.id === this.form.value.strainerId);
    expectedResult.quantitySacks = this.form.value.quantitySacks;
    expectedResult.createBatchWhenConfirm = this.form.value.createBatchWhenConfirm;
    expectedResult.batchResult = this.form.value.batchResult;

    if (!this.expectedResultEditing) {
      this.expectedResults.push(expectedResult);
    }

    this.expectedResultEditing = null;
    this.form.get('batchResult').disable();
    this.form.get('createBatchWhenConfirm').enable();
    this.buildForm(new ExpectedResult());
  }

  edit(expectedResult: ExpectedResult) {
    this.expectedResultEditing = expectedResult;

    if(!expectedResult.createdResultBatch) {
      this.changeFieldBatchResult(this.expectedResultEditing.createBatchWhenConfirm);
    } else {
      this.form.get('createBatchWhenConfirm').disable();
    }

    this.buildForm(this.expectedResultEditing);
  }

  remove(expectedResult: ExpectedResult) {
    const index = this.expectedResults.indexOf(expectedResult);
    if (index > -1) {
      this.expectedResults.splice(index, 1);
    }
  }

  handleError(error) {
    this.loading = false;
    return this.errorHandler.fromServer(error);
  }

  /**
   * Alteração do percentual. Calcula a quantidade pelo percentual,
   * baseado nos quilos de despejo selecionados.
   */
  percentualAlterado() {
    let percent = this.form.value.percentage;

    if(!percent || !this.taskBatches) return;

    let qtde = 0;
    let totalKg = 0;
    let quantitySacks = 0;
    let averageWeightSacks = NumberHelper.fromPTBR(this.averageWeightSacksString);
    if (percent && this.taskBatches) {
      
        this.taskBatches.forEach(batch => {
        // totalKg += batch.quantity;
        totalKg += batch.leftQuantity;
      });
     
      qtde = Math.round(totalKg * percent / 100);
      quantitySacks = Math.round(qtde / averageWeightSacks);
    }

    this.form.get('quantity').setValue(qtde);
    this.form.get('quantitySacks').setValue(quantitySacks);
  }

  /**
   * Atualiza lista de resultado esperado.
   * Sempre que um batch sobre alteração (inclusão, remoção, alteração de valor),
   * os resultados revem ser alterados.
   */
  atualizarListaResultadoEsperado() {
    if(!this.isModal && !this.isEditable) return;

    let averageWeightSacks = NumberHelper.fromPTBR(this.averageWeightSacksString);
    // total de quilos
    let totalKg = 0;
    if (this.taskBatches) {
      this.taskBatches.forEach(batch => {
        totalKg += batch.leftQuantity;
      });
    }

    if (this.expectedResults) {
      // atualiza valores pelos percentuais
      this.expectedResults.forEach(expectedResult => {
        expectedResult.quantity = Math.round(totalKg * expectedResult.percentage / 100);
        expectedResult.quantitySacks = Math.round(expectedResult.quantity / averageWeightSacks);
      });
    }
    
    this.percentualAlterado();
  }

  placeHolderStr(): string {
    if(this.form.value.createBatchWhenConfirm)
    {
      return 'Gerar automaticamente';
    }

    return '' ;
  }

  get quantidade() {
    let percent = this.form.value.percentage;

    if (!percent || !this.taskBatches) return 0;

    let qtde = 0;
    let totalKg = 0;

    this.taskBatches.forEach(batch => {
      // totalKg += batch.quantity;
      totalKg += batch.leftQuantity;
    });

    qtde = Math.round(totalKg * percent / 100);

    return qtde;
  }
}
