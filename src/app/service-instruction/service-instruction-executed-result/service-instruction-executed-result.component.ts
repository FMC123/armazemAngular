import {Component, Input} from "@angular/core";
import {ServiceInstruction} from "../service-instruction";
import {Masks} from "../../shared/forms/masks/masks";
import {ErrorHandler} from "../../shared/errors/error-handler";
import {ServiceInstructionService} from "../service-instruction.service";
import {Batch} from "../../batch/batch";
import {NumberHelper} from "../../shared/globalization";

@Component({
  selector: 'app-service-instruction-executed-result',
  templateUrl: './service-instruction-executed-result.component.html'
})

export class ServiceInstructionExecutedResultComponent {
  @Input('serviceInstruction') serviceInstruction: ServiceInstruction;

  batches: Array<Batch> = [];

  loading: boolean = false;
  integerMask = Masks.integerMask;
  decimalMask = Masks.decimalMask;

  constructor(
    private errorHandler: ErrorHandler,
    private serviceInstructionService: ServiceInstructionService
  ) { }

  ngOnInit() {
    this.loading = true;

    this.serviceInstructionService.listBatchsByServiceInstruction(this.serviceInstruction.id)
      .then((batches) => {
        this.batches = Batch.fromListData(batches);
      }).catch(error => this.handleError(error));

  }

  handleError(error) {
    this.loading = false;
    return this.errorHandler.fromServer(error);
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
}
