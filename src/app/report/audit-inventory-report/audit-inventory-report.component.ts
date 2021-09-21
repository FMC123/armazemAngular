import {Component, OnInit} from '@angular/core';
import {Search} from '../../shared/search/search';
import {ErrorHandler} from '../../shared/errors/error-handler';
import {Notification} from '../../shared/notification/notification';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {WarehouseStakeholderAutocomplete} from 'app/warehouse-stakeholder/warehouse-stakeholder-autocomplete';
import {Subscription} from 'rxjs';
import {WarehouseStakeholderService} from 'app/warehouse-stakeholder/warehouse-stakeholder.service';
import {Masks} from 'app/shared/forms/masks/masks';
import {BatchService} from 'app/batch/batch.service';
import {AuditInventoryReportFilter} from "./audit-inventory-report-filter";
import {Endpoints} from "../../endpoints";
import {AuditInventoryReportService} from "./audit-inventory-report.service";
import {DateTimeHelper, NumberHelper} from "../../shared/globalization";

const FileSaver = require('file-saver');

@Component({
  selector: 'app-audit-inventory-report',
  templateUrl: './audit-inventory-report.component.html'
})
export class AuditInventoryReportComponent implements OnInit {
  loading: boolean;
  search: Search = new Search();
  filter: AuditInventoryReportFilter;
  form: FormGroup;
  integerMask = Masks.integerMask;
  dateMask = Masks.dateMask;
  decimalMask = Masks.decimalMask;

  ownerAutocomplete: WarehouseStakeholderAutocomplete;
  ownerSubscription: Subscription;

  constructor(private service: BatchService,
              private formBuilder: FormBuilder,
              private warehouseStakeholderService: WarehouseStakeholderService,
              private auditInventoryReportService: AuditInventoryReportService,
              private errorHandler: ErrorHandler) {
  }

  ngOnInit() {
    Notification.clear();
    this.ownerAutocomplete = new WarehouseStakeholderAutocomplete(this.warehouseStakeholderService, this.errorHandler);
    this.buildForm();
  }

  buildForm() {
    this.form = this.formBuilder.group({
      // 'dateStartString': ['', [Validators.required]],
      'referenceDateString': [''],
      'stakeholderId': ['', [Validators.required]],
    });

    this.ownerAutocomplete.value = '';
    this.ownerSubscription = this.ownerAutocomplete.valueChange.subscribe((value) => {
      const id = value ? value.id : null;
      this.form.get('stakeholderId').setValue(id);
    });
  }

  submit() {
    Object.keys(this.form.controls).forEach((key) => {
      this.form.controls[key].markAsDirty();
    });

    if (!this.form.valid) {
      return;
    }

    this.filter = AuditInventoryReportFilter.fromData(this.form.value);
    this.filter.referenceDateString = DateTimeHelper.toDDMMYYYYHHmm((new Date()).getTime());
    console.log(this.filter.referenceDateString);
    this.gerarCsv();
  }

  gerarCsv() {
    return this.auditInventoryReportService.relatorioEstoqueAuditoriaCsv(this.filter)
      .then(response => {
        response.forEach(json => {
          let csv = '\n';
          csv += 'Relatório Lotes Estoque;;;;; ' + DateTimeHelper.toHHmm(json.createdDate) + '\n';
          csv += 'Cliente:;' + json.owner + ';;;;' + DateTimeHelper.toDDMMYYYY(json.createdDate) + '\n';

          csv += '\n';
          csv += 'N° LOTE/IS;Localiz.;Qtde.;Peso;Tipo/Peneira\n';

          json.batches.forEach(batch => {
            batch.positionInfo.forEach(pi => {
              csv += batch.batchCode + (pi.positionCode.includes('Maquinário') ? (' / ' + pi.serviceInstructionCode) :  '') + ';';
              csv += pi.positionCode + ';';
              csv += NumberHelper.toPTBR(pi.netQuantity)  + ';';
              csv += NumberHelper.toPTBR(pi.netWeight) + ' (' + NumberHelper.toPTBR1Places(pi.netWeight/batch.averageSackWeight) + ' SC);';
              csv += (pi.strainer ? pi.strainer : '') + ';';
              csv += '\n';
              // csv += ';' + ';' + '\n';
            });

          });
          FileSaver.saveAs(new Blob([csv], {type: "text/csv;charset=utf-8"}), 'RelatorioLotesEstoque.csv');
        });
      }).catch(error => {
        Notification.error('Não foi possível gerar o relatório!');
        this.loading = false;
      });
  }

  handleError(error) {
    this.loading = false;
    return this.errorHandler.fromServer(error);
  }
}
