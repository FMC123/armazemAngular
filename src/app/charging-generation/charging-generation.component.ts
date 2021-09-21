import { Component, OnInit, OnDestroy } from '@angular/core';
import { Search } from '../shared/search/search';
import { Logger } from '../shared/logger/logger';
import { ErrorHandler } from '../shared/errors/error-handler';
import { ChargingGenerationFilter } from './charging-generation-filter';
import { ServiceChargeService } from 'app/service-charge/service-charge.service';
import { ServiceCharge } from 'app/service-charge/service-charge';
import { NumberHelper, DateTimeHelper } from 'app/shared/globalization';
import { Notification } from '../shared/notification/notification';
import { ModalManager } from "../shared/shared.module";
import { Page } from '../shared/page/page';
import { ServiceChargeClient } from 'app/service-charge/service-charge-client';
import {FormBuilder, FormGroup} from "@angular/forms";
import {AuthService} from "../auth/auth.service";
const FileSaver = require('file-saver');

@Component({
  selector: 'app-charging-generation',
  templateUrl: './charging-generation.component.html'
})
export class ChargingGenerationComponent implements OnInit {
  loading: boolean;
  search: Search = new Search();
  filter: ChargingGenerationFilter;
  lista: Array<ServiceCharge>;
  precoTotalGeral: string;
  precoTotalSimples: string;
  precoTotalGS: string;
  confirmGenerateCharging: ModalManager = new ModalManager();
  confirmRemoveCharging: ModalManager = new ModalManager();
  confirmApproveCharging: ModalManager = new ModalManager();
  confirmDisapproveCharging: ModalManager = new ModalManager();
  page: Page<ServiceCharge> = new Page<ServiceCharge>();
  idServiceChargeToRemove: string;
  idServiceChargeToApprove: string;

  form: FormGroup;

  constructor(private service: ServiceChargeService,
    private errorHandler: ErrorHandler,
    private formBuilder: FormBuilder,
    private auth: AuthService,
    private logger: Logger) { }

  ngOnInit() {

    this.page.changeQuery.subscribe(() => {
      this.loadList();
    });

    this.form = this.formBuilder.group({
      'reportType': ['PDF']
    });
  }

  filterList(filter: ChargingGenerationFilter) {
    this.filter = filter;
    this.loadList();
  }

  loadList() {
    this.loading = true;
    this.service
      .listPaged(this.filter, this.page)
      .then(() => {
        this.loading = false;
      })
      .catch(error => this.handleError(error));
  }

  gerarPrecos() {
    let totalGeral: number = 0;
    let totalSimples: number = 0;
    let totalGS: number = 0;

    if (this.lista != null && this.lista.length > 0) {
      for (const reg in this.lista) {
        if (this.lista[reg].price != null) {
          totalGeral += this.lista[reg].price;

          if (this.lista[reg].serviceItem.indIss && this.lista[reg].serviceItem.indIss == true) {
            totalSimples += this.lista[reg].price;
          }

          if (this.lista[reg].serviceItem.industrialType && this.lista[reg].serviceItem.industrialType != 'N') {
            totalGS += this.lista[reg].price;
          }
        }
      }
    }

    this.precoTotalGeral = NumberHelper.toPTBR(totalGeral);
    this.precoTotalSimples = NumberHelper.toPTBR(totalSimples);
    this.precoTotalGS = NumberHelper.toPTBR(totalGS);
  }

  /**
   * Gera conbraça para a pesquisa realizada
   */
  gerarCobranca() {
    this.loading = true;
    this.service.generateCharging(this.filter).then(() => {
      this.loading = false;
      // mensagem de sucesso
      Notification.success('Cobrança gerada com sucesso.');
      // recarrega lista
      this.loadList()
    }).catch(error => this.handleError(error));
  }

  /**
   * Gera relatório analítico
   */
  gerarRelAnalitico() {

    this.loading = true;

    // CSV e PDF
    let reportType = this.form.get('reportType').value;
    if (reportType === 'CSV') {
      this.gerarRelAnaliticoCSV();
    } else {
      this.gerarRelAnaliticoPDF();
    }
  }

  /**
   * Gera analítico CSV
   */
  gerarRelAnaliticoCSV() {

    this.service.relatorioCobrancaAnaliticoLista(this.filter).then((scc: Array<ServiceChargeClient>) => {

      if (scc.length === 0) {
        Notification.error('Não foi encontrado informações para abrir o relatório!');
        this.loading = false;
      }
      else {
        let csv = 'Relatório de Cobrança Analítico;\n';
        csv += 'Período ref:;' + this.filter.createdDateStartString + ' até ' + this.filter.createdDateEndString + ';\n';

        scc.forEach(serviceChargeClient => {

          csv += 'Cliente:;' + serviceChargeClient.client.person.name + ';\n';
          csv += 'Data;Descrição;Qtde.;Sacas;Valor Unit.;Valor Total;\n';

          serviceChargeClient.serviceCharges.forEach(serviceCharge => {
            csv += serviceCharge.referenceDateString + ';';
            csv += serviceCharge.serviceItem.code + ' - ' + serviceCharge.serviceItem.description + ';';
            csv += serviceCharge.serviceItemQuantity + ';';
            csv += serviceCharge.serviceItemSackQuantity + ';';
            csv += serviceCharge.serviceItem.basePrice ? serviceCharge.serviceItem.basePriceString + ';' : ';';
            csv += serviceCharge.priceFormat + ';\n';
          });

          csv += ';;;Total Geral Cobrança:;' + serviceChargeClient.grandTotalString + ';\n';
          csv += ';;;Total Cobrança Simples:;' + serviceChargeClient.simpleTotalString + ';\n';
          csv += ';;;Total Cobrança GS Industrialização:;' + serviceChargeClient.totalIndustrializationString + ';\n';
          // duas linhas entre um cliente e outro
          csv += '\n\n';
        });

        FileSaver.saveAs(new Blob([csv], { type: "text/csv;charset=utf-8" }), 'RelatorioCobrancaAnalitico.csv');
        this.loading = false;
      }
    }).catch(error => {
      Notification.error('Não foi possível gerar o relatório!');
      this.loading = false;
    });
  }

  /**
   * Analítico PDF
   */
  gerarRelAnaliticoPDF() {

    let blob: Promise<Blob> = this.service.relatorioCobrancaAnalitico(this.filter);
    blob.then((b) => {
      if (b.size === 0) {
        Notification.error('Não foi encontrado informações para abrir o relatório!');
      } else {
        let urlReport = window.URL.createObjectURL(b);
        window.open(urlReport);
      }
      this.loading = false;
    });
  }

  /**
   * Gera relatório sintético
   */
  gerarRelSintetico() {

    this.loading = true;
    let blob: Promise<Blob> = this.service.relatorioCobrancaSintetico(this.filter);
    blob.then((b) => {
      if (b.size === 0) {
        Notification.error('Não foi encontrado informações para abrir o relatório!');
      } else {
        let urlReport = window.URL.createObjectURL(b);
        window.open(urlReport);
      }
      this.loading = false;
    });
  }

  handleError(error) {
    this.loading = false;
    return this.errorHandler.fromServer(error);
  }

  /**
   * Conforma remoção de cobrança
   * @param id
   */
  removeCharging(id: string) {
    this.idServiceChargeToRemove = id;
    this.confirmRemoveCharging.open(true);
  }

  approve(id: string){
    this.idServiceChargeToApprove = id;
    this.confirmApproveCharging.open(true);
  }

  disapprove(id: string){
    this.idServiceChargeToApprove = id;
    this.confirmDisapproveCharging.open(true);
  }

  /**
   * Remove cobrança efetivamente, após confirmação
   */
  removeChargingConfirmed() {
    this.service.delete(this.idServiceChargeToRemove).then(() => {
      Notification.success("Registro removido com sucesso.");
      this.loadList();
    }).catch(error => this.handleError(error));
  }

  approved(){
    this.service.approve(this.idServiceChargeToApprove).then(() => {
      Notification.success("Cobrança aprovada.")
      this.loadList();
    }).catch( error => this.handleError(error));
  }

  disapproved(){
    this.service.disapprove(this.idServiceChargeToApprove).then(() => {
      Notification.success("Cobrança reprovada.")
      this.loadList();
    }).catch( error => this.handleError(error));
  }

  hasAuditPermission() {
    return this.auth.hasPermission('AUDIT_CUSTOM_CHARGING') || this.auth.isAdmin;
  }
}
