import { StorageUnitOut } from '../../storage-unit/out/storage-unit-out';
import { NumberHelper } from '../../shared/globalization';
import { MarkupGroupBatchStatus } from './markup-group-batch-status';
import { MarkupGroup } from '../markup-group';
import { Position } from '../../position/position';
import { Batch } from '../../batch/batch';

export class MarkupGroupBatch {

  editing = false;
  // quantidade de sacas temporária (para transporte)
  private _sackQuantityTemp: number;
  private _quantityTemp: number;
  private _sackQuantityOriginal: number;

  static fromListData(listData: Array<MarkupGroupBatch>): Array<MarkupGroupBatch> {
    return listData.map((data) => {
      return MarkupGroupBatch.fromData(data);
    });
  }

  static fromData(data: any): MarkupGroupBatch {
    if (!data) return new this();
    let markupGroup = new this(
      data.id,
      data.currentQuantity,
      data.quantity,
      data.weightSack,
      data.status,
      data.batch,
      data.position,
      data.markupGroup,
      data.markupGroupBatchParent,
      data.storageUnitOuts,
      data.indKeepPack,
      data.local,
      false,
      data.processed,
      data.calcManual
    );
    return markupGroup;
  }

  get statusObject(): MarkupGroupBatchStatus {
    return MarkupGroupBatchStatus.fromData(this.status);
  }

  constructor(
    public id?: string,
    public currentQuantity?: number,
    public quantity?: number,
    public weightSack?: number,
    public status?: string,
    public batch?: Batch,
    public position?: Position,
    public markupGroup?: MarkupGroup,
    public markupGroupBatchParent?: MarkupGroupBatch,
    public storageUnitOuts?: Array<StorageUnitOut>,
    public indKeepPack?: Boolean,
    public local?: Boolean,
    public selectedToProccess?: boolean,
    public processed?: boolean,
    public calcManual: boolean = false
  ) {
    if (batch) {
      this.batch = Batch.fromData(batch);
    }

    if (position) {
      this.position = Position.fromData(position);
    }

    if (markupGroup) {
      this.markupGroup = MarkupGroup.fromData(markupGroup);
    }

    if (markupGroupBatchParent) {
      this.markupGroupBatchParent = MarkupGroupBatch.fromData(markupGroupBatchParent);
    }

    if (storageUnitOuts) {
      this.storageUnitOuts = StorageUnitOut.fromListData(storageUnitOuts);
    }

    this._sackQuantityTemp = this.sackQuantity;
    this._quantityTemp = this.quantity ? this.quantity : 0;
    this._sackQuantityOriginal = this.weightSack ? this.weightSack : 0 ;
  }

  set statusObject(value: MarkupGroupBatchStatus) {
    if (value) {
      this.status = value.code;
    } else {
      this.status = null;
    }
  }

  get quantityString(): string {
    return NumberHelper.toPTBR(this.quantity);
  }
  set quantityString(quantityString: string) {
    this.quantity = NumberHelper.fromPTBR(quantityString);
  }

  get currentQuantityString(): string {
    return NumberHelper.toPTBR(this.currentQuantity);
  }
  set currentQuantityString(currentQuantityString: string) {
    this.currentQuantity = NumberHelper.fromPTBR(currentQuantityString);
  }

  get weightSackString(): string {
    return NumberHelper.toPTBR0Places(this.weightSack);
  }
  set weightSackString(currentQuantityString: string) {
    this.weightSack = NumberHelper.fromPTBR(currentQuantityString);
  }

  get leftQuantity() {
    return this.quantity - (this.currentQuantity || 0);
  }

  get leftSackQuantity(){
    let calc = 0;

    if (this.quantity)
      calc = (this.leftQuantity/this.quantity) * this.weightSack;

    return Math.round(calc);
  }

  get leftQuantityString(): string {
    return NumberHelper.toPTBR(this.leftQuantity);
  }

  get leftSacksQuantityString(): string {
    return NumberHelper.toPTBR0Places(this.leftSackQuantity);
  }

  /**
   * Exibe quantidade de sacas baseado nos quilos
   */
  get sackQuantity() {
    return this.getCalcSacksByQuantity(this.quantity);
  }

  get sackQuantityString(): string {
    return NumberHelper.toPTBR0Places(this.sackQuantity);
  }

  /**
   * Calcula sacas pela quantidade em peso
   * @param quantity
   */
  public getCalcSacksByQuantity(quantity: number): number {
    if(this.calcManual && this.weightSack > 0)
    {
      return this.weightSack;
    }

    let sacks: number;
    if (this.batch && this.batch.averageWeightSack) {
      sacks = Math.round(quantity / (this.batch.averageWeightSack));
    } else {
      sacks = Math.round(quantity / 60); //todo: Colocar peso de sacar por parâmetro
    }
    // para corrigir quando zerado por causa do arredondamento
    if (sacks == 0 && quantity > 0) {
      sacks = 1;
    }
    return sacks;
  }

  /**
   * Seta valor de sacas, recalculando a quantidade de quilos,
   * validando os dados
   */
  set sackQuantity(quantity: number) {
    if (this.weightSack && !this.id) {
      this.sackQuantityTemp = this.weightSack;
    }
    else if (quantity != null && this.batch && this.batch.availableWeight) {
      let total = 0;
      if (this.batch.averageWeightSack) {
        total = Math.round(quantity * this.batch.averageWeightSack);
      }
      else {
        total = Math.round(quantity * 60);
      }

      let maxSacks = this.getCalcSacksByQuantity(this.batch.availableWeight - this.batch.warrantReservedQtd);

      if (Math.round(quantity) < 1 || Math.round(quantity) > maxSacks && false) {

        this.quantity = (this.batch.availableWeight - this.batch.warrantReservedQtd);
        this.sackQuantityTemp = maxSacks;

        throw "A quantidade de sacas deve ser um valor entre 1 e " + maxSacks + '.';
      }
      else {
        // devido aos arredondamentos, as vezes o total pode ficar maior que o disponível,
        // então precisa ser corrigido
        if (total > Math.round(this.batch.balance)) {
          total = Math.round(this.batch.balance);
        }

        this.quantity = total;
        this.sackQuantityTemp = quantity;
      }
    }
  }

  /**
   * Seta valor de sacas, recalculando a quantidade de quilos,
   * validando os dados
   */
  set kgQuantity(quantity: number) {
    this.sackQuantityTemp = this.getCalcSacksByQuantity(quantity);
  }

  public get sackQuantityTemp(): number {

    // para iniciar corretamente o valor das sacas temporárias
    // (quando não passado pelo construtor com parâmetros)
    if (this._sackQuantityTemp == null || isNaN(this._sackQuantityTemp)) {
      this._sackQuantityTemp = this.sackQuantity;
    }

    return this._sackQuantityTemp;
  }

  public set sackQuantityTemp(value: number) {
    this._sackQuantityTemp = value;
  }

  //TODO: Rever, provavelmente seria melhor de quantityOriginal
  public get quantityTemp(): number {

    if (this._quantityTemp == null || this._quantityTemp == undefined || isNaN(this._quantityTemp)) {
      this._quantityTemp = 0;
    }

    return this._quantityTemp;
  }

  public get sackQuantityOriginal(): number {
    if(this._sackQuantityOriginal == null || this._sackQuantityOriginal ==undefined || isNaN(this._sackQuantityOriginal) ){
      this._sackQuantityOriginal = 0;
    }
    return this._sackQuantityOriginal;
  }

  get calcManualString() {
    // if(this.weightSack && this.weightSack > 0)
    // {
    //   this.calcManual = true;
    // }
    return (this.calcManual) ? 'Sim' : 'Não';
  }

  set updateWeightSack(weightSack: number)  {
    if(this.calcManual)
    {
      this.weightSack = weightSack;
    } else{
      this.getCalcSacksByQuantity;
    }
  }
}
