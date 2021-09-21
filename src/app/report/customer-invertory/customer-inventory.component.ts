import { Component } from "@angular/core/src/metadata/directives";
import { ErrorHandler } from './../../shared/errors/error-handler';
import { OnInit } from "@angular/core/src/metadata/lifecycle_hooks";
import { Subscription } from 'rxjs/Rx';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { WarehouseStakeholderAutocomplete } from "../../warehouse-stakeholder/warehouse-stakeholder-autocomplete";
import { WarehouseStakeholderService } from "../../warehouse-stakeholder/warehouse-stakeholder.service";
import { CustomerInventoryService } from "./customer-inventory.service";
import { Notification } from '../../shared/notification';
import { Batch } from "app/batch/batch";
import { WarehouseStakeholder } from "app/warehouse-stakeholder/warehouse-stakeholder";
import {DateTimeHelper, NumberHelper} from '../../shared/globalization';
import { ParameterService } from "app/parameter/parameter.service";
const FileSaver = require('file-saver');

@Component({
  selector: 'customer-inventory',
  templateUrl: './customer-inventory.component.html'
})


export class CustomerInventoryComponent implements OnInit {
  loading: boolean;
  form: FormGroup;
  ownerAutocomplete: WarehouseStakeholderAutocomplete;
  ownerSubscription: Subscription;
  clientStakeholder: WarehouseStakeholder;
  replaceStakeholderForCollaborator: boolean;

  constructor(
    private service: CustomerInventoryService,
    private formBuilder: FormBuilder,
    private warehouseStakeholderService: WarehouseStakeholderService,
    private errorHandler: ErrorHandler,
    private parameterService: ParameterService,
  ) { }

  ngOnInit() {
    this.ownerAutocomplete = new WarehouseStakeholderAutocomplete(this.warehouseStakeholderService, this.errorHandler);
    this.buildForm();

    this.parameterService
      .replaceStakeholderForCollaborator()
      .then(replaceStakeholderForCollaborator => {
        this.replaceStakeholderForCollaborator = replaceStakeholderForCollaborator;
      });
  }

  buildForm() {
    this.form = this.formBuilder.group({
      'stakeholderId': ['', [Validators.required]],
      'download': ['PDF'],
    });
    this.ownerAutocomplete.value = this.clientStakeholder;
    this.ownerSubscription = this.ownerAutocomplete.valueChange.subscribe((value) => {
      const id = value ? value.id : null;
      this.form.get('stakeholderId').setValue(id);
      this.clientStakeholder = this.ownerAutocomplete.value;
    });
  }

  submit() {
    Object.keys(this.form.controls).forEach((key) => {
      this.form.controls[key].markAsDirty();
    });
    const download = this.form.get('download').value;


    if (!this.form.valid) {
      return;
    }

    this.clientStakeholder = this.ownerAutocomplete.value;
    this.loading = true;

    if (download==='CSV'){
      // abre relatório em CSV
      this.downloadCSV();
    }

    else if (download==='PDF'){
      // abre relatório em PDF
      this.downloadPDF();
    }


  }

  /**
   * Download em CSV
   */
  downloadCSV() {

    this.service.relatorioEstoqueClienteLista(this.clientStakeholder.id).then((batches: Array<Batch>) => {

      if (batches.length === 0) {
        Notification.error('Não foi encontrado informações para abrir o relatório!');
        this.loading = false;
      }
      else {
        // pode ser cliente ou depositante, dependendo do parãmetro
        let labelCliente = (this.replaceStakeholderForCollaborator) ? 'Cliente:' : 'Depositante:';

        let totalSacas = 0;
        let totalPeso = 0;
        let totalEmb = 0;
        let totalQtdeIs = 0;
        let totalTransfer = 0;
        let totalSaldo = 0;
        let totalSubRefSum = 0;
        let totalSaldoSc = 0;

        let csv = 'Relatório de estoque do Cliente;\n';
        csv += labelCliente + ';' + this.clientStakeholder.person.name + ';Data de referência:;' + DateTimeHelper.toDDMMYYYY(new Date().getTime()) + ';\n';
        csv += 'Cód Lote;Entrada;Sacas Entrada;Peso Entrada;Tipo;Peneira;Baixa por embarque;Baixa por processo;Baixa por transferência;Saldo (Kg); Saldo Físico; Saldo (Sc);Ref.Client;Certific.;Contamin.\n';

        batches.forEach(batch => {
          csv += batch.batchCode + ';';
          csv += batch.receivedAtString + ';';
          csv += NumberHelper.toPTBR( batch.netQuantity ? batch.netQuantity : 0) + ';';
          csv += batch.netWeightString + ';';
          csv += batch.drink ? batch.drink.name + ';' : ';';
          csv += batch.strainer ? batch.strainer.description + ';' : ';';
          csv += batch.outWarehouseString + ';';
          csv += batch.outProcessString + ';';
          csv += batch.outTransferOwnershipString + ';';
          csv += batch.balanceString + ';';
          csv += NumberHelper.toPTBR(batch.storageUnitBatchesQuantityRefSum) + ';';
          csv += batch.balanceSacksString + ';';
          csv += (batch.refClient ? batch.refClient : '') + ';';
          csv += batch.certificateNames + ';';  //fazer
          csv += (batch.contaminant ? 'SIM' : 'NÃO') + ';\n';

          totalSacas += batch.netQuantity | 0;
          totalPeso += batch.netWeight;
          totalEmb += batch.outWarehouse;
          totalQtdeIs += batch.outProcess;
          totalTransfer += batch.outTransferOwnership;
          totalSaldo += batch.balance;
          totalSubRefSum += batch.storageUnitBatchesQuantityRefSum;
          totalSaldoSc += batch.balanceSacks;
        });

        csv += 'Total estoque;;' + NumberHelper.toPTBR( totalSacas) + ';' + NumberHelper.toPTBR( totalPeso) + ';;;' + NumberHelper.toPTBR( totalEmb) + ';' + NumberHelper.toPTBR( totalQtdeIs) + ';' + NumberHelper.toPTBR( totalTransfer) + ';' + NumberHelper.toPTBR( totalSaldo) + ';' + NumberHelper.toPTBR(totalSubRefSum) + ';' + NumberHelper.toPTBR( totalSaldoSc) + ';\n';
        FileSaver.saveAs(new Blob([csv], { type: "text/csv;charset=utf-8" }), 'RelatorioEstoqueCliente.csv');
        this.loading = false;
      }
    }).catch(error => {
      Notification.error('Não foi possível gerar o relatório!');
      this.loading = false;
    });

  }

  /**
   * Download em PDF
   */
  downloadPDF() {

    let blob: Promise<Blob> = this.service.relatorioEstoqueCliente(this.clientStakeholder.id);
    blob.then((b) => {

      if (b.size === 0) {
        Notification.error('Não foi encontrado informações para abrir o relatório!');
      } else {
        let urlReport = window.URL.createObjectURL(b);
        window.open(urlReport);
      }

      this.loading = false;
    }).catch(error => {
      Notification.error('Não foi possível gerar o relatório!');
      this.loading = false;
    });
  }
}
