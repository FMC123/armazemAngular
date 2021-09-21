import { BatchStatus } from '../../batch/batch-status';
import { ModalManager } from '../../shared/modals/modal-manager';
import { BatchLog } from '../batch-log';
import { Component, Input, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {BatchLogService} from "../batch-log.service";
import {ClassificationService} from "../../classification/classification.service";

@Component({
  selector: 'app-batch-log-list-info',
  templateUrl: './batch-log-list-info.component.html'
})
export class BatchLogListInfoComponent implements OnInit {
  @Input() batchLog: BatchLog;

  logModal: ModalManager = new ModalManager();

  leftColumn: Array<any>;

  constructor(private route: ActivatedRoute,
              private classService: ClassificationService) { }

  ngOnInit() {
    if (this.batchLog) {

      this.leftColumn = [
        ['Código', this.batchLog.batchCode],
        ['Status', this.batchLog ? new BatchStatus(this.batchLog.status).name : ''],
        ['Posição', this.batchLog.position ? this.batchLog.position.nameCode : ''],
        ['% TI', this.batchLog.impurityContent ? this.batchLog.impurityContent : ''],
        ['% TU', this.batchLog.moistureContent ? this.batchLog.moistureContent : ''],
        ['Quantidade', this.batchLog.netQuantity ? this.batchLog.netQuantity : ''],
        ['Tipo de armazenamento', this.batchLog.unitType ? this.batchLog.unitType : ''],
        ['Referência do Cliente', this.batchLog.refClient ? this.batchLog.refClient : ''],
        ['Peso Bruto', this.batchLog.grossWeight ? this.batchLog.grossWeightString : ''],
        ['Peso da tara', this.batchLog.tareWeight ? this.batchLog.tareWeightString : ''],
        ['Peso Líquido', this.batchLog.netWeightCalcString],
        ['Romaneio', this.batchLog.batchOperation ? this.batchLog.batchOperation.batchOperationCode : ''],
        ['Peneira', this.batchLog.strainer && this.batchLog.strainer.code ?
          `${this.batchLog.strainer.code} - ${this.batchLog.strainer.description}` : ''],
        ['Bebida', this.batchLog.drink && this.batchLog.drink.code ?
          `${this.batchLog.drink.code} - ${this.batchLog.drink.name}` : ''],
        ['Embalagem', this.batchLog.packType && this.batchLog.packType.code ?
          `${this.batchLog.packType.code} - ${this.batchLog.packType.description}` : ''],
        ['Usuário', this.batchLog.createdBy ? this.batchLog.createdBy.name : ''],
        ['Data de alteração', this.batchLog.createdDate ? this.batchLog.createdDateString : ''],
        ['Data de exclusão', this.batchLog.deletedDate ? this.batchLog.deletedDateString : ''],
        ['Balança do peso bruto', this.batchLog.grossWeightScale ? this.batchLog.grossWeightScale.description : ''],
        ['Data da pesagem do peso bruto', this.batchLog.grossWeighedDate ? this.batchLog.grossWeighedDateString : ''],
        ['Peso bruto digitado', this.batchLog.grossWeightTyped ? 'SIM' : 'NÃO'],
        ['Balança do peso tara', this.batchLog.tareWeightScale ? this.batchLog.tareWeightScale.description : ''],
        ['Data da pesagem do peso da tara', this.batchLog.tareWeighedDate ? this.batchLog.tareWeighedDateString : ''],
        ['Peso da tara digitado', this.batchLog.tareWeightTyped ? 'SIM' : 'NÃO'],
      ];

      this.classService.findAuthorizedUntilDateBySampleId(this.batchLog.batch.sample.id, null)
        .then(classVersion => {
          if (classVersion) {
            let itens = new Array<string>();
            classVersion.items.forEach(item => {
              if (item.classificationType.showOnMapFilter)
                itens = itens.concat(item.classificationType.name.concat(': ').concat(item.value));
            });
            this.leftColumn = this.leftColumn.concat([['Classificação', itens.join('\n')]]);
          }
        }).catch(error => {

      });
      }
    }
  }
