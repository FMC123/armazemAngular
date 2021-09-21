import { AuthService } from './../auth/auth.service';
import { Injectable } from '@angular/core';
import { ServiceInstructionListFilter } from './service-instruction-list/service-instruction-list-filter';
import { Page } from '../shared/page/page';
import { ServiceInstruction } from './service-instruction';
import { URLSearchParams, Http, ResponseContentType, Headers } from '@angular/http';
import { Endpoints } from '../endpoints';
import { MarkupGroupBatch } from '../markup-group/batch/markup-group-batch';
import { MarkupGroup } from '../markup-group/markup-group';
import { ServiceInstructionReportFilter } from 'app/service-instruction/service-instruction-report/service-instruction-report-filter';
import { ErrorHandler } from 'app/shared/errors/error-handler';
import { Batch } from "../batch/batch";
import { ParameterService } from 'app/parameter/parameter.service';
import { IndustrializationFiscalNote } from './service-instruction-report/industrialization-fiscal-note/industrialization-fiscal-note';
import {ServiceInstructionItem} from "./service-instruction-item";
import { BatchOperation } from 'app/batch-operation/batch-operation';
import { ExpectedResult } from './expected-result';
import { ServiceInstructionTask } from './service-instruction-task';
import { ProportionalEvictionBatchOperation } from './service-instruction-proportional-eviction/proportional-eviction-batch-operation';

@Injectable()
export class ServiceInstructionService {

  private headers = new Headers({ 'Content-Type': 'application/json' });

  constructor(
    private http: Http,
    private auth: AuthService,
    private parameterService: ParameterService
  ) { }

  listPaged(
    filter: ServiceInstructionListFilter,
    page: Page<ServiceInstruction>
  ) {
    //page.setResult(data, data.length, 'code', 'DESC');
    //return Promise.resolve(page);
    let params = new URLSearchParams();
    params.appendAll(page.toURLSearchParams());
    params.appendAll(filter.toURLSearchParams());
    return this.http
      .get(`${Endpoints.serviceInstructionUrl}/paged`, { search: params })
      .toPromise()
      .then(response => {
        page.setResultFromServer(response.json());
        page.data = ServiceInstruction.fromListData(page.data);
        return page;
      });
  }

  isArmazemGeral(): boolean {
    let isArmazemGeral = this.auth.findParameterValue('SERVICE_INSTRUCTION_FOR');
    return isArmazemGeral !== null && isArmazemGeral === 'Armazém Geral'
  }

  userIsLeader(): boolean {
    return this.auth.accessToken.leader;
  }

  findMarkupGroup(serviceInstructionId, sampleTrackingId): Promise<MarkupGroup> {
    let url = `${Endpoints.serviceInstructionUrl}/find-markup-group`;
    let params = new URLSearchParams();
    params.append('serviceInstructionId', serviceInstructionId);
    params.append('sampleTrackingId', sampleTrackingId);

    return this.http.get(url, { search: params })
      .toPromise()
      .then(response => {
        return MarkupGroup.fromData(response.json());
      });
  }

  listBatchsBySampleTracking(serviceInstructionId, sampleTrackingId): Promise<Array<MarkupGroupBatch>> {
    let url = `${Endpoints.serviceInstructionUrl}/list-batchs-by-sample-tracking`;
    let params = new URLSearchParams();
    params.append('serviceInstructionId', serviceInstructionId);
    params.append('sampleTrackingId', sampleTrackingId);

    return this.http.get(url, { search: params })
      .toPromise()
      .then(response => {
        return MarkupGroupBatch.fromListData(response.json());
      });
  }

  listBatchsByServiceInstruction(serviceInstructionId): Promise<Array<Batch>> {
    let url = `${Endpoints.serviceInstructionUrl}/list-result-batches`;
    let params = new URLSearchParams();
    params.append('serviceInstructionId', serviceInstructionId);

    return this.http.get(url, { search: params })
      .toPromise()
      .then(response => {
        return Batch.fromListData(response.json());
      });
  }

  listByServiceInstruction(serviceInstructionId): Promise<Array<BatchOperation>> {
    let url = `${Endpoints.batchOperationUrl}/by-service-instruction/${serviceInstructionId}`;
    let params = new URLSearchParams();
    // params.append('serviceInstructionId', serviceInstructionId);

    return this.http.get(url, { search: params })
      .toPromise()
      .then(response => {
        return BatchOperation.fromListData(response.json());
      });
  }


  find(id: string) {
    let url = `${Endpoints.serviceInstructionUrl}/${id}`;
    return this.http.get(url)
      .toPromise()
      .then(response => {
        return ServiceInstruction.fromData(response.json());
      });
    // return Promise.resolve(data[0]);
  }

  save(serviceInstruction: ServiceInstruction): Promise<ServiceInstruction> {
    return this.http
      .post(
        Endpoints.serviceInstructionUrl,
        serviceInstruction,
        { headers: this.auth.appendOrCreateAuthHeader(this.headers) }
      )
      .toPromise()
      .then(res => res.json());
  }

  cancel(serviceInstructionId: number | string): Promise<void> {
    let url = `${Endpoints.serviceInstructionUrl}/${serviceInstructionId}`;
    return this.http.delete(
      url,
      { headers: this.auth.appendOrCreateAuthHeader(this.headers) }
    )
      .toPromise()
      .then(() => null);
  }

  confirm(serviceInstruction: ServiceInstruction): Promise<ServiceInstruction> {
    return this.http
      .put(
        Endpoints.serviceInstructionUrl + '/confirm',
        serviceInstruction,
        { headers: this.auth.appendOrCreateAuthHeader(this.headers) }
      )
      .toPromise()
      .then(res => res.json().data);
  }

  partialConfirm(serviceInstruction: ServiceInstruction): Promise<ServiceInstruction> {
    return this.http
      .put(
        Endpoints.serviceInstructionUrl + '/partialConfirm',
        serviceInstruction,
        { headers: this.auth.appendOrCreateAuthHeader(this.headers) }
      )
      .toPromise()
      .then(res => {
        return res.json()});
  }

  finish(serviceInstruction: ServiceInstruction): Promise<ServiceInstruction> {
    return this.http
      .put(
        Endpoints.serviceInstructionUrl + '/finish',
        serviceInstruction,
        { headers: this.auth.appendOrCreateAuthHeader(this.headers) }
      )
      .toPromise()
      .then(res => res.json().data);
  }

  insertIndustrializationFiscalNote(industrializationFiscalNote: IndustrializationFiscalNote) {
    const url = `${Endpoints.industrializationFiscalNoteUrl}`;
		return this.http
			.post(url, JSON.stringify(industrializationFiscalNote), {
				headers: this.auth.appendOrCreateAuthHeader(this.headers)
			})
			.toPromise()
			.then(res => IndustrializationFiscalNote.fromData(res.json()));
  }

  updateIndustrializationFiscalNote(industrializationFiscalNote: IndustrializationFiscalNote) {
    const url = `${Endpoints.industrializationFiscalNoteUrl}`;
		return this.http
			.put(url, JSON.stringify(industrializationFiscalNote), {
				headers: this.auth.appendOrCreateAuthHeader(this.headers)
			})
			.toPromise()
			.then(res => IndustrializationFiscalNote.fromData(res.json()));
  }

  deleteIndustrializationFiscalNote(industrializationFiscalNoteId: number | string): Promise<void> {
    let url = `${Endpoints.industrializationFiscalNoteUrl}/${industrializationFiscalNoteId}`;
    return this.http.delete(
      url,
      { headers: this.auth.appendOrCreateAuthHeader(this.headers) }
    )
      .toPromise()
      .then(() => null);
  }

  findByStakeholderAndDate(stakeholderId: number | string,initialDate: string, finalDate: string): Promise<Array<IndustrializationFiscalNote>> {
    let url = `${Endpoints.industrializationFiscalNoteUrl}/find-by-stakeholder-and-date/${stakeholderId}/${initialDate}/${finalDate}`;
    return this.http
    .get(url, { headers: this.auth.appendOrCreateAuthHeader(this.headers) })
    .toPromise().then(response => {
      return IndustrializationFiscalNote.fromListData(response.json());
    });
  }


  sendMail(serviceInstructionId: string): Promise<void> {

    let url = `${Endpoints.serviceInstructionUrl}/sendMail`;
    let params = new URLSearchParams();
    params.append('serviceInstructionId', serviceInstructionId);

    return this.http.get(url, { search: params })
      .toPromise()
      .then(() => null);
  }

  printOrientation(serviceInstructionId: string): Promise<void> {

    let url = `${Endpoints.serviceInstructionUrl}/print-orientation`;
    let params = new URLSearchParams();
    params.append('serviceInstructionId', serviceInstructionId);
    return this.http
      .get(url, { responseType: ResponseContentType.Blob, search: params })
      .toPromise()
      .then(response => {
        window.open(window.URL.createObjectURL(response.blob()));
      });
  }

  printTaskOrientation(serviceInstructionId: string, taskOrder: number): Promise<void> {
    let url = `${Endpoints.serviceInstructionUrl}/print-orientation`;
    let params = new URLSearchParams();
    params.append('serviceInstructionId', serviceInstructionId);
    params.append('taskOrder', "" + taskOrder);
    return this.http
      .get(url, { responseType: ResponseContentType.Blob, search: params })
      .toPromise()
      .then(response => {
        window.open(window.URL.createObjectURL(response.blob()));
      });
  }

  /**
   * Relatório de despejo proporcional
   *
   * @param serviceInstructionId
   */
  printProportionalEvictionReport(serviceInstructionId: string): Promise<void> {
    /**
     * O relatório deverá ser gerado no mesmo momento em que se imprime o Relatório da Guia de Instrução de Serviço,
     * caso o parâmetro “Utilizar despejo proporcional na Instrução de Serviço?” contiver o valor “S”.
     */
    if (this.parameterService.serviceInstructionUseProportionalEviction() == true) {

      let url = `${Endpoints.serviceInstructionUrl}/print-proportional-eviction`;
      let params = new URLSearchParams();
      params.append('serviceInstructionId', serviceInstructionId);
      return this.http
        .get(url, { responseType: ResponseContentType.Blob, search: params })
        .toPromise()
        .then(response => {
          window.open(window.URL.createObjectURL(response.blob()));
        });
    }
    else {
      return new Promise(resolve => {
        resolve(null);
      });
    }
  }

  /**
   * Relatório resumo de guia de serviço
   * @param filter
   */
  reportSummaryServiceInstruction(filter: ServiceInstructionReportFilter): Promise<Blob> {

    let url = `${Endpoints.serviceInstructionReportUrl}`;
    return this.http.post(url, JSON.stringify(filter), {
      headers: this.auth.appendOrCreateAuthHeader(this.headers),
      responseType: ResponseContentType.Blob
    }).toPromise().then(response => {
      return response.blob();
    });
  }

  /**
   * Relatório de industrialização de guia de serviço
   * @param filter
   */
  reportIndustrializationServiceInstruction(filter: ServiceInstructionReportFilter): Promise<Blob> {

    let url = `${Endpoints.serviceInstructionIndustrializationReportUrl}`;
    return this.http.post(url, JSON.stringify(filter), {
      headers: this.auth.appendOrCreateAuthHeader(this.headers),
      responseType: ResponseContentType.Blob
    }).toPromise().then(response => {
      return response.blob();
    });
  }

  /**
   * Relatório analítico de previsão de despejo
   * @param filter
   */
  forecastEvictionAnalyticalReport(filter: ServiceInstructionReportFilter): Promise<Blob> {

    let url = `${Endpoints.forecastEvictionAnalyticalReportUrl}`;
    return this.http.post(url, JSON.stringify(filter), {
      headers: this.auth.appendOrCreateAuthHeader(this.headers),
      responseType: ResponseContentType.Blob
    }
    )
      .toPromise()
      .then(response => {
        return response.blob();
      });
  }

  /**
   * Relatório sintético de previsão de despejo
   * @param filter
   */
  forecastEvictionSyntheticReport(filter: ServiceInstructionReportFilter): Promise<Blob> {

    let url = `${Endpoints.forecastEvictionSyntheticReportUrl}`;
    return this.http.post(url, JSON.stringify(filter), {
      headers: this.auth.appendOrCreateAuthHeader(this.headers),
      responseType: ResponseContentType.Blob
    }
    )
      .toPromise()
      .then(response => {
        return response.blob();
      });
  }

  receive(batchId: string, markupGroupBatchId: string,  serviceInstruction: ServiceInstruction) {
    let url = `${Endpoints.serviceInstructionUrl}/receive/${batchId}/${markupGroupBatchId}`;
    return this.http
      .post(
        url,
        serviceInstruction,
        { headers: this.auth.appendOrCreateAuthHeader(this.headers) }
      )
      .toPromise()
      .then(res => {
        return ServiceInstruction.fromData(res.json());
      });
  }

  reopen(serviceInstruction: ServiceInstruction): Promise<ServiceInstruction> {
    return this.http
      .put(
        Endpoints.serviceInstructionUrl + '/reopen',
        serviceInstruction,
        { headers: this.auth.appendOrCreateAuthHeader(this.headers) }
      )
      .toPromise()
      .then(res => res.json().data);
  }

  approveItem(item: ServiceInstructionItem): Promise<ServiceInstructionItem> {
    return this.http.put(`${Endpoints.serviceInstructionItemUrl}/approve/${item.id}`,
      item,
      { headers: this.auth.appendOrCreateAuthHeader(this.headers) }
      )
      .toPromise()
      .then( res => ServiceInstructionItem.fromData(res.json()) )
  }

  disapproveItem(item: ServiceInstructionItem): Promise<ServiceInstructionItem> {
    return this.http.put(`${Endpoints.serviceInstructionItemUrl}/disapprove/${item.id}`,
      item,
      { headers: this.auth.appendOrCreateAuthHeader(this.headers) }
      )
      .toPromise()
      .then( res => ServiceInstructionItem.fromData(res.json()) )
  }

  unapproveItem(item: ServiceInstructionItem): Promise<ServiceInstructionItem> {
    return this.http.put(`${Endpoints.serviceInstructionItemUrl}/unapprove/${item.id}`,
      item,
      { headers: this.auth.appendOrCreateAuthHeader(this.headers) }
      )
      .toPromise()
      .then( res => ServiceInstructionItem.fromData(res.json()) )
  }

  saveEditedItem(item: ServiceInstructionItem): Promise<ServiceInstructionItem> {
    return this.http.put(`${Endpoints.serviceInstructionItemUrl}`,
      item,
      { headers: this.auth.appendOrCreateAuthHeader(this.headers) }
    )
      .toPromise()
      .then( res => ServiceInstructionItem.fromData(res.json()) )
  }

  saveTask(serviceInstruction: ServiceInstruction, task: ServiceInstructionTask): Promise<Array<BatchOperation>>{
    return this.http.post(`${Endpoints.serviceInstructionUrl}/${serviceInstruction.id}/saveTask`,
    task,
    { headers: this.auth.appendOrCreateAuthHeader(this.headers) }
    ).toPromise().then()
  }

  deleteTask(serviceInstruction: ServiceInstruction, task: ServiceInstructionTask): Promise<void> {
    return this.http
      .delete(
        `${Endpoints.serviceInstructionUrl}/${serviceInstruction.id}/task/${task.taskOrder}`,
        { headers: this.auth.appendOrCreateAuthHeader(this.headers) }
      )
      .toPromise()
      .then(() => null);
  }

  fillProportionalEviction(pebo: ProportionalEvictionBatchOperation): Promise<ProportionalEvictionBatchOperation> {
    let url = `${Endpoints.serviceInstructionProportionalEvictionUrl}/fill`;

    return this.http.post(url, pebo, { headers: this.auth.appendOrCreateAuthHeader(this.headers) })
      .toPromise()
      .then(res => {
        return ProportionalEvictionBatchOperation.fromData(res.json());
    });
  }

  calcProportionalEviction(pebo: ProportionalEvictionBatchOperation): Promise<ProportionalEvictionBatchOperation> {
    let url = `${Endpoints.serviceInstructionProportionalEvictionUrl}/calc`;

    return this.http.post(url, pebo, { headers: this.auth.appendOrCreateAuthHeader(this.headers) })
      .toPromise()
      .then(res => {
        return ProportionalEvictionBatchOperation.fromData(res.json());
    });
  }

  saveProportionalEviction(pebo: ProportionalEvictionBatchOperation): Promise<ProportionalEvictionBatchOperation> {
    let url = `${Endpoints.serviceInstructionProportionalEvictionUrl}/save`;

    return this.http.post(url, pebo, { headers: this.auth.appendOrCreateAuthHeader(this.headers) })
      .toPromise()
      .then(res => {
        return ProportionalEvictionBatchOperation.fromData(res.json());
    });
  }

}
