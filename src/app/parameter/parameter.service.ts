import { ParameterType } from './parameter-type';
import { Endpoints } from './../endpoints';
import { Injectable } from '@angular/core';
import { Http, Headers, URLSearchParams } from '@angular/http';

import { Parameter } from './parameter';
import { AuthService } from './../auth/auth.service';
import { Page } from './../shared/page/page';
import { toPromise } from 'rxjs/operator/toPromise';
import {BehaviorSubject} from "rxjs";

@Injectable()
export class ParameterService {
  private headers = new Headers({ 'Content-Type': 'application/json' });

  private batchSwapExpocaccerSubject$: BehaviorSubject<boolean>;

  constructor(private http: Http, private auth: AuthService) { }

  types(): Promise<Array<ParameterType>> {
    return this.http
      .get(`${Endpoints.parametersUrl}/types`)
      .toPromise()
      .then(response => {
        return ParameterType.fromListData(response.json());
      });
  }

  replaceStakeholderForCollaborator(): Promise<boolean> {
    return Promise.resolve(
      this.auth.findParameterBoolean('COLLABORATOR_AT_FISCAL_NOTE_IN')
    );
  }

  sacksInKilos(): Promise<number> {

    let sacksInKilos: number = Number(this.auth.findParameterValue('SACKS_IN_KILOS'));

    // valor padrão se não está definido a quantidade de sacas em quilos
    if (!sacksInKilos) {
      sacksInKilos = 60;
    }

    return Promise.resolve(sacksInKilos);
  }

  batchOperationWeightTolerance(): number {
    let weightTolerance: number = Number(this.auth.findParameterValue('BATCH_OPERATION_WEIGHT_TOLERANCE'));
    if(!weightTolerance){
      weightTolerance = 60;
    }
    return weightTolerance;
  }

  listPaged(filter: any, page: Page<Parameter>) {
    let params = new URLSearchParams();
    params.appendAll(page.toURLSearchParams());
    params.append('filter', filter ? filter : '');
    return this.http
      .get(`${Endpoints.parametersUrl}/paged`, {
        search: params
      })
      .toPromise()
      .then(response => {
        page.setResultFromServer(response.json());
        page.data = Parameter.fromListData(page.data);
        return page;
      });
  }

  find(id: number | string) {
    let url = `${Endpoints.parametersUrl}/${id}`;
    return this.http
      .get(url)
      .toPromise()
      .then(response => {
        let parameter = Parameter.fromData(response.json());
        return parameter;
      });
  }

  findByKey(key: string) {
    let url = `${Endpoints.parametersUrl}/key/${key}`;
    return this.http
      .get(url)
      .toPromise()
      .then(response => {
        if (response != null) {

          // se a resposta for sem valor, ocorre exceção
          try {
            let parameter = Parameter.fromData(response.json());
            return parameter;
          }
          catch (e) { }
        }

        return null;
      });
  }

  save(parameter: Parameter): Promise<Parameter> {
    if (parameter.id) {
      return this.update(parameter);
    } else {
      return this.create(parameter);
    }
  }

  delete(id: number | string): Promise<void> {
    let url = `${Endpoints.parametersUrl}/${id}`;
    return this.http
      .delete(url, {
        headers: this.auth.appendOrCreateAuthHeader(this.headers)
      })
      .toPromise()
      .then(() => {
        this.updateListParameters();
        return null;
      });
  }

  private create(parameter: Parameter): Promise<Parameter> {
    const url = `${Endpoints.parametersUrl}`;
    return this.http
      .post(url, JSON.stringify(parameter), {
        headers: this.auth.appendOrCreateAuthHeader(this.headers)
      })
      .toPromise()
      .then(res => {
        return this.updateListParameters()
          .then(() => {
            return res.json()
          });
      });
  }

  private update(parameter: Parameter): Promise<Parameter> {
    const url = `${Endpoints.parametersUrl}/${parameter.id}`;
    return this.http
      .put(url, parameter, {
        headers: this.auth.appendOrCreateAuthHeader(this.headers)
      })
      .toPromise()
      .then(() => {
        return this.updateListParameters()
          .then(() => {
            return parameter;
          })
      });
  }

  /**
   * Verifica se a nota fiscal é a tela padrão.
   * Se não exitse nenhum parâmetro configurado, a tela de nota fiscal é o padrão.
   */
  public fiscalNoteScreenDefault(): boolean {

    let parameter = this.auth.findParameterValue('INPUT_PREVIEW_SCREEN_DEFAULT');

    if (parameter == null || parameter.toUpperCase() == 'Nota fiscal de entrada'.toUpperCase()) {
      return true;
    }

    return false;
  }

  /**
   * Verifica se a ordem de compra é a tela padrão.
   */
  public purchaseOrderScreenDefault(): boolean {

    let parameter = this.auth.findParameterValue('INPUT_PREVIEW_SCREEN_DEFAULT');

    if (parameter != null && parameter.toUpperCase() == 'Ordem de compra'.toUpperCase()) {
      return true;
    }

    return false;
  }


  /**
   * Verifica se os parâmetros da instrução de serviço é para Armazém Geral
   */
  public specificParamsServiceInstructionWahehouseGeneral(): boolean {

    let parameter = this.auth.findParameterValue('SERVICE_INSTRUCTION_FOR');

    if (parameter != null && parameter.toUpperCase() == 'Armazém Geral'.toUpperCase()) {
      return true;
    }

    return false;
  }

  /**
   * Verifica se usa despejo proporcional
   */
  public serviceInstructionUseProportionalEviction(): boolean {

    let parameter = this.auth.findParameterValue('SERVICE_INSTRUCTION_USE_PROPORTIONAL_EVICTION');

    if (parameter != null && parameter.toUpperCase() == 'S'.toUpperCase()) {
      return true;
    }

    return false;
  }

  /**
   * Quantidade máxima para despejo proporcional
   */
  public serviceInstructionMaxProportionalEviction(): number {

    let parameter = this.auth.findParameterValue('SERVICE_INSTRUCTION_MAX_PROPORTIONAL_EVICTION');

    if (parameter != null) {
      let valor: number = parseInt(parameter, 10);
      if (isNaN(valor) == false) {
        return valor;
      }
    }

    return 0;
  }


  /**
   * Verificar se é para pular a validação de peso da operação em lote
   */
  public skipValidationBatchOperationWeight(): boolean {

    let parameter = this.auth.findParameterValue('BYPASS_BATCH_OPERATION_WEIGHT_CHECK');

    if (parameter != null && parameter.toUpperCase() == 'S'.toUpperCase()) {
      return true;
    }

    return false;
  }

  public batchSwapExpocaccerValue (){
    let parameter = this.auth.findParameterValue('BATCH_SWAP_EXPOCACCER');
    return parameter === 'S';
  }

  get batchSwapExpocaccerSubject(): BehaviorSubject<any> {
    if (!this.batchSwapExpocaccerSubject$) {
      this.batchSwapExpocaccerSubject$ = new BehaviorSubject<boolean>(this.batchSwapExpocaccerValue());
    }
    return this.batchSwapExpocaccerSubject$;
  }

  batchSwapExpocaccerTrigger() {
    if (this.batchSwapExpocaccerSubject$) {
      this.batchSwapExpocaccerSubject$.next(this.batchSwapExpocaccerValue());
    }
  }

  public purchaseForecastAllWarehouses(): boolean {

    let parameter = this.auth.findParameterValue('FORECAST_LOCAL_WAREHOUSE');

    return parameter != null && parameter.toUpperCase() == 'S'.toUpperCase();
  }

  public clientCodeBeforeName(): boolean {
    let p = this.auth.findParameterValue('CLIENT_CODE_BEFORE_NAME');
    return p != null && p.toUpperCase() == 'S'.toUpperCase();
  }

  public fiscalNoteNumberOfDigits(): string {
    let p = this.auth.findParameterValue('FISCAL_NOTE_NUMBER_OF_DIGITS');
    return p;
  }

  public useEntryForecastTransportation(): boolean {
    let p = this.auth.findParameterValue('USE_ENTRY_FORECAST_TRANSPORTATION');
    return p !== null && p.toUpperCase() === 'S'.toUpperCase();
  }

  public usePurchaseOrderTransportation(): boolean {
    let p = this.auth.findParameterValue('USE_PURCHASE_ORDER_TRANSPORTATION');
    return p !== null && p.toUpperCase() === 'S'.toUpperCase();
  }

  public powerBiReportId(): string {
    let p = this.auth.findParameterValue('POWER_BI_REPORT_ID');
    return p;
  }

  public powerBiReportIdList(): Array<[number,string,string]>{
    let p = [];

    for(let i = 1; i <= 10; i++){
      let name = this.auth.findParameterValue('POWER_BI_REPORT_NAME_' + (i < 10 ? '0'+i : i ));
      let id = this.auth.findParameterValue('POWER_BI_REPORT_ID_' + (i < 10 ? '0'+i : i ));
      if(name && id && this.auth.hasPermission('POWERBI_REPORT_ID_' + (i < 10 ? '0'+i : i ))) {
        p.push([i,name, id]);
      }

    }
    return p;
  }

  public powerBiUsername(): string {
    let p = this.auth.findParameterValue('POWER_BI_USERNAME');
    return p;
  }

  public powerBiPassword(): string {
    let p = this.auth.findParameterValue('POWER_BI_PASSWORD');
    return p;
  }

  public powerBiBaseURL(): string {
    let p = this.auth.findParameterValue('POWER_BI_BASEURL');
    if(p && !p.endsWith('/')){
      p += '/';
    }
    return p;
  }

  public balanceWeightingMode(): string {
    let p = this.auth.findParameterValue('BALANCE_WEIGHTING_MODE');
    return p;
  }

  public shipmentLargerThanAuthorization(): boolean {
    let p = this.auth.findParameterValue('CREATE_SHIPMENTS_LARGER_THAN_AUTHORIZATION');
    return p !== null && p.toUpperCase() === 'S'.toUpperCase();
  }

  public dashboardShowPowerBI(): boolean {
    let p = this.auth.findParameterValue('DASHBOARD_SHOW_POWER_BI');
    return p !== null && p.toUpperCase() === 'S'.toUpperCase();
  }

  public dashboardShowLobby(): boolean {
    let p = this.auth.findParameterValue('DASHBOARD_SHOW_LOBBY');
    return !(p !== null && p.toUpperCase() === 'N'.toUpperCase());
  }

  public dashboardShowSummary(): boolean {
    let p = this.auth.findParameterValue('DASHBOARD_SHOW_SUMMARY');
    return !(p !== null && p.toUpperCase() === 'N'.toUpperCase());
  }

  public dashboardShowStock(): boolean {
    let p = this.auth.findParameterValue('DASHBOARD_SHOW_STOCK');
    return !(p !== null && p.toUpperCase() === 'N'.toUpperCase());
  }

  /**
   * Atualiza lista de parâmetros (para o caso de alteração)
   */
  private updateListParameters() {
    return this.auth.fillParametersIfHasWarehouse();
  }
}
