import {Component, Input} from "@angular/core";
import {ServiceInstruction} from "../service-instruction";
import {Masks} from "../../shared/forms/masks/masks";
import {ErrorHandler} from "../../shared/errors/error-handler";
import {ServiceInstructionService} from "../service-instruction.service";
import {Batch} from "../../batch/batch";
import {NumberHelper} from "../../shared/globalization";
import { BatchOperation } from "app/batch-operation/batch-operation";
import { ServiceInstructionFormComponent } from "../service-instruction-form/service-instruction-form.component";
import { ProportionalEvictionBatchOperation } from "../service-instruction-proportional-eviction/proportional-eviction-batch-operation";
import { ProportionalEvictionBatch } from "../service-instruction-proportional-eviction/proportional-eviction-batch";
import { ModalManager } from "app/shared/shared.module";
import { ProportionalEviction } from "../service-instruction-proportional-eviction/proportional-eviction";
import { MarkupGroupBatch } from "app/markup-group/batch/markup-group-batch";
import { Notification } from "app/shared/notification";

@Component({
  selector: 'app-service-instruction-batch-operation',
  templateUrl: './service-instruction-batch-operation.component.html',
  styleUrls: ['service-instruction-batch-operation.component.css']
})

export class ServiceInstructionBatchOperationComponent {
  @Input('serviceInstruction') serviceInstruction: ServiceInstruction;
  @Input() parent: ServiceInstructionFormComponent;

  batches: Array<Batch> = [];
  batcheOperations: Array<BatchOperation> = [];
  dumpProportionalModal: ModalManager = new ModalManager();

  @Input() loading: boolean = false;
  integerMask = Masks.integerMask;
  decimalMask = Masks.decimalMask;
  proportionalEvictionBatchOperation: ProportionalEvictionBatchOperation = new ProportionalEvictionBatchOperation();
  proportionalEvictionBatchOperationValid: ProportionalEvictionBatchOperation = new ProportionalEvictionBatchOperation();

  batchOperation: any;
  deleteConfirm: ModalManager = new ModalManager();
  feedbackConfirm: ModalManager = new ModalManager();
  formModal = new ModalManager();

  constructor(
    private errorHandler: ErrorHandler,
    private serviceInstructionService: ServiceInstructionService
  ) { }

  ngOnInit() {
    this.loadList();
  }

  loadList() {
    this.loading = true;

    this.serviceInstructionService.listByServiceInstruction(this.serviceInstruction.id)
      .then((batcheOperations) => {
        this.loading = false;
        this.batcheOperations = BatchOperation.fromListData(batcheOperations);
        this.parent.taskBatchOperations = this.batcheOperations;
      }).catch(error => this.handleError(error));

  }

  handleError(error) {
    this.loading = false;
    return this.errorHandler.fromServer(error);
  }

  proportionalEvictionModal(event, batchOperation: BatchOperation){
    this.dumpProportionalModal.open(null);

    this.serviceInstructionService.fillProportionalEviction(this.fillProportionalEviction(batchOperation))
    .then(ref => {
      this.proportionalEvictionBatchOperation = ProportionalEvictionBatchOperation.fromData(ref);
      this.proportionalEvictionBatchOperationValid = ProportionalEvictionBatchOperation.fromData(ref);
      this.proportionalEvictionBatchOperationValid.proportionalEvictionBatch = ProportionalEvictionBatch.fromListData(ref.proportionalEvictionBatch);
    });
  }

  getTotalWeight() {
    let totalWeight: number = 0;
    if (this.serviceInstruction != null && this.serviceInstruction.markupGroup != null) {
      this.batches.forEach(batch => { totalWeight += batch.netWeight})
      return NumberHelper.toPTBR(totalWeight);
    } else {
      return NumberHelper.toPTBR(0);
    }
  }

  /**
   * Quantidade total de sacas dos lotes selecionados
   */
  getTotalSacks() {

    let totalSacks: number = 0;

    if (this.serviceInstruction != null && this.serviceInstruction.markupGroup != null) {
      this.batches.forEach( batch => { totalSacks += JSON.parse(batch.netQuantityValue)});
      return totalSacks;
    }
  }

  onFormClose() {
    this.formModal.close();
    this.loadList();
  }

  editTaskModal(batchOperation: BatchOperation) {
    this.parent.editTaskModal(batchOperation);
  }

  beforeDelete(batOperation: BatchOperation) {
    this.batchOperation = batOperation;
    this.deleteConfirm.open(null);
  }

  deleteTask(batchOperation: BatchOperation) {
    this.parent.deleteTask(batchOperation)
    .then(() => {
      this.loadList();
      this.loading = false;
    })
    .catch((error) => this.handleError(error));
  }

  addTaskBatchesInServiceInstruction(batchOperation: BatchOperation) {
    batchOperation.batches.forEach(b => {
      let mgb = new MarkupGroupBatch();
      mgb.quantity = b.availableWeight;
      mgb.batch = b;
      this.addBatchInServiceInstruction(mgb);
    });
  }


  fillProportionalEviction(batchOperation: BatchOperation): ProportionalEvictionBatchOperation {
    const steps = batchOperation.serviceInstruction.proportionalDumpingSteps;
    let peBatches = [];
    batchOperation.markupGroup.batches.forEach(batch => {
      let peList = [];
      for (let i = 1; i <= steps; i++ ) {
        let pe = new ProportionalEviction(i, 0);
        peList.push(pe);
      }
      let peBatch = new ProportionalEvictionBatch(batch, 0, peList);
      peBatches.push(peBatch);
    });

    return new ProportionalEvictionBatchOperation(batchOperation, steps, peBatches, 0, 0, []);
  }

  runSimulation() {
    const isValid = this.isProportionalEvictionValid(false);

    if(!isValid) return;

    this.serviceInstructionService.calcProportionalEviction(this.proportionalEvictionBatchOperation)
    .then(ref => {
      this.proportionalEvictionBatchOperation = ProportionalEvictionBatchOperation.fromData(ref);
    });
  }

  saveProportionalEviction() {
    const isValid = this.isProportionalEvictionValid(true);

    if(!isValid) return;

    this.serviceInstructionService.saveProportionalEviction(this.proportionalEvictionBatchOperation)
    .then(ref => {
      this.proportionalEvictionBatchOperation = ProportionalEvictionBatchOperation.fromData(ref);
    });
    (<any>jQuery)('.modal').modal('hide');
    this.dumpProportionalModal.close();
  }

  resetProportionalEviction() {
    this.proportionalEvictionBatchOperation.proportionalEvictionBatch
      .map(peBatch => {
        peBatch.quantityBags = 0;
        peBatch.proportionalEviction
        .map(res =>
          res.quantity = 0
          )
      });
    this.proportionalEvictionBatchOperation.totalQuantityBags = 0;
    this.proportionalEvictionBatchOperation.totalQuantityPerRound.fill(0);
  }

  isProportionalEvictionValid(isSave: Boolean) : Boolean {
    let isValid = true;

    this.proportionalEvictionBatchOperation.proportionalEvictionBatch.forEach((peb) => {
      if(peb.quantityBags < 0 ){
        Notification.error(`Quantidade de bags do lote ${peb.markupGroupBatch.batch.batchCode} inválida.`);
        isValid = false;
        return;
      }

      if(isSave) {
        const sumRoundBags = peb.proportionalEviction.reduce((total, per) => {return total += per.quantity}, 0);
        if(sumRoundBags !== peb.quantityBags || sumRoundBags === 0 || peb.quantityBags === 0) {
          Notification.error(`Soma do despejo proporcional do lote ${peb.markupGroupBatch.batch.batchCode} inválida.`);
          isValid = false;
          return;
        }
      }

      const pebValid = this.proportionalEvictionBatchOperationValid.proportionalEvictionBatch.find(
        po => po.markupGroupBatch.batch.batchCode === peb.markupGroupBatch.batch.batchCode
      );

      if(peb.quantityBags > pebValid.quantityBags){
        Notification.error(`Quantidade de bags do lote ${peb.markupGroupBatch.batch.batchCode} acima do limite (${pebValid.quantityBags}).`);
        isValid = false;
        return;
      }
    });

    return isValid;
  }

  /**
     * Adiciona lote na Instrução de Serviço
     * @param markupGroupBatch
     */
  addBatchInServiceInstruction(markupGroupBatch: MarkupGroupBatch) {

    // não pode adicionar se já existe
    if (!this.isBatchSelectedInServiceInstruction(markupGroupBatch.batch))
      this.serviceInstruction.markupGroup.batches.push(markupGroupBatch);
  }

  /**
   * Verifica se todos os lotes da task (batchOperation out) estão adicionados na Instrução de Serviço
   *
   * @param batchOperation
   * @returns
   */
  isTaskResultInServiceInstruction(batchOperation: BatchOperation): boolean {
    return batchOperation.batches.every(b => this.isBatchSelectedInServiceInstruction(b));
  }

  isBatchSelectedInServiceInstruction(batch: Batch): boolean {
    return this.findBatchIndexInServiceInstruction(batch) >= 0;
  }

  /**
   * Verifica se o lote informado já está selecionado na IS, retornando o índice do mesmo
   * @param batch
   */
   findBatchIndexInServiceInstruction(batch: Batch): number {
    if (this.serviceInstruction.markupGroup.batches && batch && batch.id) {
      for (let i = 0; i < this.serviceInstruction.markupGroup.batches.length; i++) {
        if (this.serviceInstruction.markupGroup.batches[i].batch.id == batch.id) {
          return i;
        }
      }
    }

    return -1;
  }

  printTaskReport(serviceInstruction: ServiceInstruction, taskOrder: number) {
    this.loading = true;
    this.serviceInstructionService.printTaskOrientation(serviceInstruction.id, taskOrder)
    .catch(error => this.handleError(error))
    .then(() => {
      this.loading = false;
    });
  }
}
